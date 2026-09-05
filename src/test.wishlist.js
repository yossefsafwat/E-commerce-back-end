// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Wishlist from "./models/Wishlist.model.js";
// import Product from "./models/Product.model.js";

// dotenv.config();

// const testWishlist = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URL);

//     console.log("MongoDB Connected");
//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 1: Create a valid Wishlist
//     // =========================================================

//     const testUserId = new mongoose.Types.ObjectId();
//     const productId1 = new mongoose.Types.ObjectId();
//     const productId2 = new mongoose.Types.ObjectId("6a9b2e1e5cc34b9975ffa18a");

//     await Wishlist.deleteMany({ user: testUserId });

//     const validWishlist = new Wishlist({
//       user: testUserId,
//       products: [productId1, productId2],
//     });

//     await validWishlist.save();

//     console.log("TEST 1 PASSED: Valid wishlist saved successfully");
//     console.log("Wishlist ID:", validWishlist._id);
//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 2: Wishlist without user
//     // =========================================================

//     const invalidWishlist = new Wishlist({
//       products: [productId1],
//     });

//     try {
//       await invalidWishlist.save();

//       console.log("TEST 2 FAILED: Wishlist without user was saved");
//     } catch (error) {
//       console.log("TEST 2 PASSED: Wishlist without user was rejected");
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 3: Empty products array
//     // =========================================================

//     const emptyWishlist = new Wishlist({
//       user: new mongoose.Types.ObjectId(),
//       products: [],
//     });

//     try {
//       await emptyWishlist.save();

//       console.log("TEST 3 PASSED: Empty products array was accepted");
//     } catch (error) {
//       console.log("TEST 3 FAILED: Empty products array was rejected");
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 4: Wishlist with one product
//     // =========================================================

//     const singleProductWishlist = new Wishlist({
//       user: new mongoose.Types.ObjectId(),
//       products: [new mongoose.Types.ObjectId()],
//     });

//     try {
//       await singleProductWishlist.save();

//       console.log("TEST 4 PASSED: Single product wishlist was saved");
//     } catch (error) {
//       console.log("TEST 4 FAILED: Single product wishlist was rejected");
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 5: Wishlist with multiple products
//     // =========================================================

//     const multipleProductsWishlist = new Wishlist({
//       user: new mongoose.Types.ObjectId(),
//       products: [
//         new mongoose.Types.ObjectId(),
//         new mongoose.Types.ObjectId(),
//         new mongoose.Types.ObjectId(),
//       ],
//     });

//     try {
//       await multipleProductsWishlist.save();

//       console.log(
//         "TEST 5 PASSED: Multiple products wishlist was saved"
//       );
//     } catch (error) {
//       console.log(
//         "TEST 5 FAILED: Multiple products wishlist was rejected"
//       );
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 6: Invalid user ObjectId
//     // =========================================================

//     const invalidUserWishlist = new Wishlist({
//       user: "not-a-valid-object-id",
//       products: [],
//     });

//     try {
//       await invalidUserWishlist.save();

//       console.log("TEST 6 FAILED: Invalid user ID was accepted");
//     } catch (error) {
//       console.log("TEST 6 PASSED: Invalid user ID was rejected");
//       console.log("Error:", error.message);
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 7: Unique user
//     // =========================================================

// // TEST 7: Duplicate wishlist for the same user
// try {
//   const duplicateUserId = new mongoose.Types.ObjectId();

//   // First wishlist for this user
//   const wishlist1 = new Wishlist({
//     user: duplicateUserId,
//     products: [],
//   });

//   await wishlist1.save();

//   // Second wishlist using THE SAME user ID
//   const wishlist2 = new Wishlist({
//     user: duplicateUserId,
//     products: [],
//   });

//   await wishlist2.save();

//   console.log(
//     "TEST 7 FAILED: Duplicate wishlist for the same user was accepted"
//   );
// } catch (error) {
//   console.log(
//     "TEST 7 PASSED: Duplicate wishlist for the same user was rejected"
//   );
//   console.log("Error:", error.message);
// }

//     // =========================================================
//     // TEST 8: Check timestamps
//     // =========================================================

//     if (validWishlist.createdAt && validWishlist.updatedAt) {
//       console.log("TEST 8 PASSED: Timestamps were created");
//     } else {
//       console.log("TEST 8 FAILED: Timestamps were not created");
//     }

//     console.log("----------------------------------");

//     // =========================================================
//     // TEST 9: Check products population
//     // =========================================================

//     const foundWishlist = await Wishlist.findById(validWishlist._id);

//     if (foundWishlist) {
//       console.log("TEST 9 PASSED: Wishlist was found using findById");
//       console.log("Products:", foundWishlist.products);
//     } else {
//       console.log("TEST 9 FAILED: Wishlist could not be found");
//     }

//     console.log("----------------------------------");

//     console.log("All Wishlist schema tests completed.");

//   } catch (error) {
//     console.error("Test failed:", error.message);
//   } finally {
//     await mongoose.disconnect();
//     console.log("MongoDB Disconnected");
//   }
// };

// testWishlist();