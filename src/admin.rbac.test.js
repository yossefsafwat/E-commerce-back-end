import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from './index.js';
import User from './models/User.model.js'; 

describe('Week 4: Admin Access Control & RBAC Tests', () => {
  let customerToken, adminToken;
  let customerUser, adminUser;
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DB_URI || process.env.MONGO_URI);
    }

    const unique = Date.now();
    const secret = process.env.JWT_SECRET || 'testsecret';

    customerUser = await User.create({
      username: `customer_${unique}`,
      email: `customer_${unique}@test.com`,
      password: 'Password123!',
      role: 'customer'
    });

    customerToken = jwt.sign(
      { _id: customerUser._id.toString(), role: customerUser.role, email: customerUser.email },
      secret,
      { expiresIn: '1h' }
    );

    adminUser = await User.create({
      username: `admin_${unique}`,
      email: `admin_${unique}@test.com`,
      password: 'Password123!',
      role: 'admin'
    });

    adminToken = jwt.sign(
      { _id: adminUser._id.toString(), role: adminUser.role, email: adminUser.email },
      secret,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    if (customerUser?._id) await User.deleteOne({ _id: customerUser._id });
    if (adminUser?._id) await User.deleteOne({ _id: adminUser._id });

    if (mongoose.connection) {
      await mongoose.connection.close();
    }
  });

  describe('Unauthenticated Access Denial (401)', () => {
    it('should block unauthenticated requests to Admin users endpoint', async () => {
      const res = await request(app).get('/admin/users');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Role-Based Authorization - Customer Denial', () => {
    it('should reject non-admin (Customer) from fetching admin users list', async () => {
      const res = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${customerToken}`);

      expect([401, 403]).toContain(res.statusCode);
    });

    it('should reject non-admin (Customer) from performing admin actions on a user', async () => {
      const res = await request(app)
        .delete(`/admin/users/${customerUser._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect([401, 403]).toContain(res.statusCode);
    });
  });

  describe('Role-Based Authorization - Admin Allowed', () => {
    it('should allow Admin user to access admin users management list', async () => {
      const res = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect([200, 404]).toContain(res.statusCode);
    });
  });
});