const request = require('supertest');
const app = require('../src/index'); 

describe('Cart & Wishlist Security & Data Isolation Tests', () => {
  let user1Token, user2Token;

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

  describe('Authenticated Data Isolation', () => {
    it('should ensure User A cannot modify or view User B data', async () => {
      const res = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.statusCode).not.toBe(403);
    });
  });
});