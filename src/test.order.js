// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Order from "./models/Order.model.js";

// dotenv.config();

// const testOrder = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URL);

//     console.log("MongoDB Connected");
//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 1: Create a valid Order
//     // =========================================================

//     const validOrder = new Order({
//       user: new mongoose.Types.ObjectId(),

//       items: [
//         {
//           product: new mongoose.Types.ObjectId(),
//           name: "iPhone 16 Pro",
//           image: "https://example.com/iphone.jpg",
//           price: 60000,
//           quantity: 1,
//         },
//         {
//           product: new mongoose.Types.ObjectId(),
//           name: "AirPods Pro",
//           image: "https://example.com/airpods.jpg",
//           price: 8000,
//           quantity: 2,
//         },
//       ],

//       shippingAddress: {
//         fullName: "Youssef Ahmed",
//         phone: "01012345678",
//         country: "Egypt",
//         city: "Assiut",
//         address: "123 Main Street",
//         postalCode: "71511",
//       },

//       paymentMethod: "cash",
//       paymentStatus: "pending",

//       subtotal: 76000,
//       shippingFee: 100,
//       tax: 0,
//       discount: 1000,
//       totalPrice: 75100,

//       status: "pending",

//       customerNote: "Please deliver during the afternoon.",
//     });

//     await validOrder.save();

//     console.log("TEST 1 PASSED: Valid order saved successfully");
//     console.log("Order ID:", validOrder._id);

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 2: Check default values
//     // =========================================================

//     console.log("Payment Method:", validOrder.paymentMethod);
//     console.log("Payment Status:", validOrder.paymentStatus);
//     console.log("Status:", validOrder.status);
//     console.log("Shipping Fee:", validOrder.shippingFee);
//     console.log("Tax:", validOrder.tax);
//     console.log("Discount:", validOrder.discount);

//     if (
//       validOrder.paymentMethod === "cash" &&
//       validOrder.paymentStatus === "pending" &&
//       validOrder.status === "pending" &&
//       validOrder.shippingFee === 100 &&
//       validOrder.tax === 0 &&
//       validOrder.discount === 1000
//     ) {
//       console.log("TEST 2 PASSED: Order values/defaults work correctly");
//     } else {
//       console.log("TEST 2 FAILED: Order values/defaults are incorrect");
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 3: Invalid Order - Missing required fields
//     // =========================================================

//     const invalidOrder = new Order({
//       user: new mongoose.Types.ObjectId(),

//       // Missing:
//       // items
//       // shippingAddress
//       // subtotal
//       // totalPrice
//     });

//     try {
//       await invalidOrder.save();

//       console.log("TEST 3 FAILED: Invalid order was saved");
//     } catch (error) {
//       console.log("TEST 3 PASSED: Invalid order was rejected");
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 4: Invalid Order - Invalid payment method
//     // =========================================================

//     const invalidPaymentOrder = new Order({
//       user: new mongoose.Types.ObjectId(),

//       items: [
//         {
//           product: new mongoose.Types.ObjectId(),
//           name: "Test Product",
//           image: "https://example.com/product.jpg",
//           price: 1000,
//           quantity: 1,
//         },
//       ],

//       shippingAddress: {
//         fullName: "Test User",
//         phone: "01012345678",
//         country: "Egypt",
//         city: "Assiut",
//         address: "Test Street",
//         postalCode: "71511",
//       },

//       paymentMethod: "bitcoin",

//       subtotal: 1000,
//       totalPrice: 1000,
//     });

//     try {
//       await invalidPaymentOrder.save();

//       console.log("TEST 4 FAILED: Invalid payment method was accepted");
//     } catch (error) {
//       console.log("TEST 4 PASSED: Invalid payment method was rejected");
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 5: Invalid Order - Invalid status
//     // =========================================================

//     const invalidStatusOrder = new Order({
//       user: new mongoose.Types.ObjectId(),

//       items: [
//         {
//           product: new mongoose.Types.ObjectId(),
//           name: "Test Product",
//           image: "https://example.com/product.jpg",
//           price: 1000,
//           quantity: 1,
//         },
//       ],

//       shippingAddress: {
//         fullName: "Test User",
//         phone: "01012345678",
//         country: "Egypt",
//         city: "Assiut",
//         address: "Test Street",
//         postalCode: "71511",
//       },

//       paymentMethod: "cash",
//       subtotal: 1000,
//       totalPrice: 1000,

//       status: "something-invalid",
//     });

//     try {
//       await invalidStatusOrder.save();

//       console.log("TEST 5 FAILED: Invalid order status was accepted");
//     } catch (error) {
//       console.log("TEST 5 PASSED: Invalid order status was rejected");
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 6: Invalid Order - Quantity less than 1
//     // =========================================================

//     const invalidQuantityOrder = new Order({
//       user: new mongoose.Types.ObjectId(),

//       items: [
//         {
//           product: new mongoose.Types.ObjectId(),
//           name: "Test Product",
//           image: "https://example.com/product.jpg",
//           price: 1000,
//           quantity: 0,
//         },
//       ],

//       shippingAddress: {
//         fullName: "Test User",
//         phone: "01012345678",
//         country: "Egypt",
//         city: "Assiut",
//         address: "Test Street",
//         postalCode: "71511",
//       },

//       paymentMethod: "cash",
//       subtotal: 1000,
//       totalPrice: 1000,
//     });

//     try {
//       await invalidQuantityOrder.save();

//       console.log("TEST 6 FAILED: Invalid quantity was accepted");
//     } catch (error) {
//       console.log("TEST 6 PASSED: Invalid quantity was rejected");
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 7: Invalid Order - Negative price
//     // =========================================================

//     const invalidPriceOrder = new Order({
//       user: new mongoose.Types.ObjectId(),

//       items: [
//         {
//           product: new mongoose.Types.ObjectId(),
//           name: "Test Product",
//           image: "https://example.com/product.jpg",
//           price: -500,
//           quantity: 1,
//         },
//       ],

//       shippingAddress: {
//         fullName: "Test User",
//         phone: "01012345678",
//         country: "Egypt",
//         city: "Assiut",
//         address: "Test Street",
//         postalCode: "71511",
//       },

//       paymentMethod: "cash",
//       subtotal: 1000,
//       totalPrice: 1000,
//     });

//     try {
//       await invalidPriceOrder.save();

//       console.log("TEST 7 FAILED: Negative price was accepted");
//     } catch (error) {
//       console.log("TEST 7 PASSED: Negative price was rejected");
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     console.log("All Order schema tests completed.");

//   } catch (error) {
//     console.error("Test failed:", error.message);
//   } finally {
//     await mongoose.disconnect();
//     console.log("MongoDB Disconnected");
//   }
// };

// testOrder();