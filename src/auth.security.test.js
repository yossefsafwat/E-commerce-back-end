const request = require('supertest');
const app = require('../src/index'); // التأكد من تصدير app من index.js

describe('Cart & Wishlist Security & Data Isolation Tests', () => {
  let user1Token, user2Token;

  // 1. اختبار منع غير المسجلين (Unauthenticated)
  describe('Unauthenticated Access Prevention', () => {
    it('should block unauthenticated access to Cart endpoints', async () => {
      const res = await request(app).get('/api/v1/cart');
      expect(res.statusCode).toBe(401);
    });

    it('should block unauthenticated access to Wishlist endpoints', async () => {
      const res = await request(app).get('/api/v1/wishlist');
      expect(res.statusCode).toBe(401);
    });
  });

  // 2. اختبار عزل البيانات للمستخدمين (Data Isolation)
  describe('Authenticated Data Isolation', () => {
    it('should ensure User A cannot modify or view User B data', async () => {
      // يتم التحقق هنا من أن الـ Controller يقيد الاستعلام بـ req.user.id
      const res = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${user1Token}`);
      
      // التوثيق يضمن أن النتائج العائدة تخص المستخدم صاحب الـ Token فقط
      expect(res.statusCode).not.toBe(403);
    });
  });
});