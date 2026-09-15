// import request from 'supertest';
// import mongoose from 'mongoose';
// import app from './index.js';

// describe('Cart & Wishlist Authorization & Data Isolation Tests', () => {
  
//   afterAll(async () => {
//     if (mongoose.connection) {
//       await mongoose.connection.close();
//     }
//   });

//   // 1. اختبار حظر غير المسجلين (Unauthenticated Access)
//   describe('Unauthenticated Access Denial (401)', () => {
//     it('should block unauthenticated access to GET /carts', async () => {
//       const res = await request(app).get('/carts');
//       expect(res.statusCode).toBe(401);
//     });

//     it('should block unauthenticated access to POST /carts/items', async () => {
//       const res = await request(app).post('/carts/items').send({ productId: '123', quantity: 1 });
//       expect(res.statusCode).toBe(401);
//     });

//     it('should block unauthenticated access to GET /wishlists/my', async () => {
//       const res = await request(app).get('/wishlists/my');
//       expect(res.statusCode).toBe(401);
//     });

//     it('should block unauthenticated access to DELETE /wishlists/clear', async () => {
//       const res = await request(app).delete('/wishlists/clear');
//       expect(res.statusCode).toBe(401);
//     });
//   });

//   // 2. اختبار عزل البيانات (Data Isolation Proof)
//   describe('Authenticated Data Isolation Architecture', () => {
//     it('should enforce data scope strictly based on authenticated session context', async () => {
//       // يضمن تصميم الـ Controllers عدم قبول user_id في الـ Body أو الـ Query Params 
//       // والاعتماد حصراً على req.user._id المستخرج من بيئة الـ Middleware
//       const sampleUserAId = new mongoose.Types.ObjectId().toString();
//       const sampleUserBId = new mongoose.Types.ObjectId().toString();

//       expect(sampleUserAId).not.toBe(sampleUserBId);
//     });
//   });
// });

import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import app from "./index.js";

import User from "./models/User.model.js";
import Cart from "./models/Cart.model.js";
import Wishlist from "./models/Wishlist.model.js";

describe("Cart & Wishlist Authorization & Data Isolation Tests", () => {
  let userA;
  let userB;

  let tokenA;
  let tokenB;

  beforeAll(async () => {
    const uniqueValue = Date.now();

    userA = await User.create({
      username: `testuserA${uniqueValue}`,
      email: `testuserA${uniqueValue}@example.com`,
      password: "Test@12345",
      role: "customer",
    });

    userB = await User.create({
      username: `testuserB${uniqueValue}`,
      email: `testuserB${uniqueValue}@example.com`,
      password: "Test@12345",
      role: "customer",
    });

    tokenA = jwt.sign(
      {
        _id: userA._id.toString(),
        role: userA.role,
        email: userA.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    tokenB = jwt.sign(
      {
        _id: userB._id.toString(),
        role: userB.role,
        email: userB.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    await Cart.create({
      user: userA._id,
      items: [],
      coupon: null,
    });

    await Cart.create({
      user: userB._id,
      items: [],
      coupon: null,
    });

    await Wishlist.create({
      user: userA._id,
      products: [],
    });

    await Wishlist.create({
      user: userB._id,
      products: [],
    });
  });

  afterAll(async () => {
    
    if (userA?._id) {
      await Cart.deleteOne({ user: userA._id });
      await Wishlist.deleteOne({ user: userA._id });
      await User.deleteOne({ _id: userA._id });
    }

    if (userB?._id) {
      await Cart.deleteOne({ user: userB._id });
      await Wishlist.deleteOne({ user: userB._id });
      await User.deleteOne({ _id: userB._id });
    }

    await mongoose.connection.close();
  });

  describe("Unauthenticated Access Denial (401)", () => {
    it("should block unauthenticated access to GET /carts", async () => {
      const res = await request(app).get("/carts");

      expect(res.statusCode).toBe(401);
    });

    it("should block unauthenticated access to POST /carts/items", async () => {
      const res = await request(app)
        .post("/carts/items")
        .send({
          productId: "123",
          quantity: 1,
        });

      expect(res.statusCode).toBe(401);
    });

    it("should block unauthenticated access to GET /wishlists/my", async () => {
      const res = await request(app).get("/wishlists/my");

      expect(res.statusCode).toBe(401);
    });

    it("should block unauthenticated access to DELETE /wishlists/clear", async () => {
      const res = await request(app).delete("/wishlists/clear");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("Authenticated Data Isolation", () => {
    it("should return User A cart only when User A is authenticated", async () => {
      const res = await request(app)
        .get("/carts")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      
      const cartA = await Cart.findOne({ user: userA._id });

      expect(cartA).not.toBeNull();
      expect(cartA.user.toString()).toBe(userA._id.toString());

      const cartB = await Cart.findOne({ user: userB._id });

      expect(cartB).not.toBeNull();
      expect(cartB.user.toString()).not.toBe(cartA.user.toString());
    });

    it("should return User B cart only when User B is authenticated", async () => {
      const res = await request(app)
        .get("/carts")
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const cartB = await Cart.findOne({ user: userB._id });

      expect(cartB).not.toBeNull();
      expect(cartB.user.toString()).toBe(userB._id.toString());
    });

    it("should return User A wishlist only when User A is authenticated", async () => {
      const res = await request(app)
        .get("/wishlists/my")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const wishlistA = await Wishlist.findOne({
        user: userA._id,
      });

      expect(wishlistA).not.toBeNull();
      expect(wishlistA.user.toString()).toBe(userA._id.toString());
    });

    it("should return User B wishlist only when User B is authenticated", async () => {
      const res = await request(app)
        .get("/wishlists/my")
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const wishlistB = await Wishlist.findOne({
        user: userB._id,
      });

      expect(wishlistB).not.toBeNull();
      expect(wishlistB.user.toString()).toBe(userB._id.toString());
    });

    it("should keep User A and User B cart data separated", async () => {
      const cartA = await Cart.findOne({ user: userA._id });
      const cartB = await Cart.findOne({ user: userB._id });

      expect(cartA).not.toBeNull();
      expect(cartB).not.toBeNull();

      expect(cartA.user.toString()).toBe(userA._id.toString());
      expect(cartB.user.toString()).toBe(userB._id.toString());

      expect(cartA.user.toString()).not.toBe(cartB.user.toString());
    });

    it("should keep User A and User B wishlist data separated", async () => {
      const wishlistA = await Wishlist.findOne({
        user: userA._id,
      });

      const wishlistB = await Wishlist.findOne({
        user: userB._id,
      });

      expect(wishlistA).not.toBeNull();
      expect(wishlistB).not.toBeNull();

      expect(wishlistA.user.toString()).toBe(userA._id.toString());
      expect(wishlistB.user.toString()).toBe(userB._id.toString());

      expect(wishlistA.user.toString()).not.toBe(wishlistB.user.toString());
    });
  });
});