import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.model.js";
dotenv.config();

const testProduct = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");
    console.log("----------------------------------");

    // =========================================================
    // TEST 1: Create a valid Product
    // =========================================================
    await Product.findOneAndDelete({name:"iPhone 16 Pro Test"})
    const validProduct = new Product({
      name: "iPhone 16 Pro Test",
      shortDescription: "Apple smartphone",
      description: "A powerful Apple smartphone for testing.",
      price: 60000,
      discountPrice: 55000,
      stock: 10,
      sku: "IPHONE-16-PRO-TEST-001",

      images: [
        {
          public_id: "test_iphone_16",
          url: "https://example.com/iphone.jpg",
        },
      ],

      category: "Electronics",
      subcategory: "Phones",
      brand: "Apple",
      tags: ["iPhone", "Apple", "Mobile"],

      createdBy: new mongoose.Types.ObjectId(),
    });

    await validProduct.save();

    console.log("TEST 1 PASSED: Valid product saved successfully");
    console.log("Product ID:", validProduct._id);
    console.log("----------------------------------");

    // =========================================================
    // TEST 2: Check automatic slug generation
    // =========================================================

    console.log("TEST 2 - Generated Slug:", validProduct.slug);

    if (validProduct.slug === "iphone-16-pro-test") {
      console.log("TEST 2 PASSED: Slug generated correctly");
    } else {
      console.log("TEST 2 FAILED: Slug is incorrect");
    }

    console.log("----------------------------------");

    // =========================================================
    // TEST 3: Check lowercase fields
    // =========================================================

    console.log("Category:", validProduct.category);
    console.log("Subcategory:", validProduct.subcategory);
    console.log("Tags:", validProduct.tags);

    if (
      validProduct.category === "electronics" &&
      validProduct.subcategory === "phones" &&
      validProduct.tags.includes("iphone") &&
      validProduct.tags.includes("apple")
    ) {
      console.log("TEST 3 PASSED: Lowercase transformation works");
    } else {
      console.log("TEST 3 FAILED: Lowercase transformation is incorrect");
    }

    console.log("----------------------------------");

    // =========================================================
    // TEST 4: Create an invalid Product
    // =========================================================

    const invalidProduct = new Product({
      name: "Invalid Product Test",
      shortDescription: "Invalid product",
      description: "Testing invalid product data.",
      price: -100,
      stock: 10,
      category: "electronics",
      createdBy: new mongoose.Types.ObjectId(),
    });

    try {
      await invalidProduct.save();

      console.log("TEST 4 FAILED: Invalid product was saved");
    } catch (error) {
      console.log("TEST 4 PASSED: Invalid product was rejected");
      console.log("Error:", error.message);
    }

    console.log("----------------------------------");

    // =========================================================
    // TEST 5: Test calcAverageRating()
    // =========================================================

    const ratingProduct = new Product({
      name: "Rating Test Product",
      shortDescription: "Product for rating test",
      description: "Testing average rating calculation.",
      price: 1000,
      stock: 5,
      category: "test",
      createdBy: new mongoose.Types.ObjectId(),

      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          rating: 5,
          comment: "Excellent",
        },
        {
          user: new mongoose.Types.ObjectId(),
          rating: 3,
          comment: "Good",
        },
        {
          user: new mongoose.Types.ObjectId(),
          rating: 4,
          comment: "Very good",
        },
      ],
    });

    ratingProduct.calcAverageRating();

    console.log("Average Rating:", ratingProduct.averageRating);
    console.log("Number of Reviews:", ratingProduct.numReviews);

    if (ratingProduct.averageRating === 4 && ratingProduct.numReviews === 3) {
      console.log("TEST 5 PASSED: Rating calculation works correctly");
    } else {
      console.log("TEST 5 FAILED: Rating calculation is incorrect");
    }

    console.log("----------------------------------");

    // =========================================================
    // TEST 6: Test Product with no reviews
    // =========================================================

    const noReviewsProduct = new Product({
      name: "No Reviews Test Product",
      shortDescription: "Product without reviews",
      description: "Testing product with no reviews.",
      price: 500,
      stock: 5,
      category: "test",
      createdBy: new mongoose.Types.ObjectId(),
      reviews: [],
    });

    noReviewsProduct.calcAverageRating();

    console.log("Average Rating:", noReviewsProduct.averageRating);
    console.log("Number of Reviews:", noReviewsProduct.numReviews);

    if (
      noReviewsProduct.averageRating === 0 &&
      noReviewsProduct.numReviews === 0
    ) {
      console.log("TEST 6 PASSED: Empty reviews handled correctly");
    } else {
      console.log("TEST 6 FAILED: Empty reviews handled incorrectly");
    }

    console.log("----------------------------------");
     
    // TEST 7: Add a Review
    
const reviewProduct = await Product.findOne({
  name: "iPhone 16 Pro Test",
})

reviewProduct.reviews.push({
  user: new mongoose.Types.ObjectId(),
  rating: 5,
  comment: "Excellent product",
})

reviewProduct.calcAverageRating()
await reviewProduct.save()

console.log("After adding a review:")
console.log("Average Rating:", reviewProduct.averageRating)
console.log("Number of Reviews:", reviewProduct.numReviews)

if (
  reviewProduct.averageRating === 5 &&
  reviewProduct.numReviews === 1
) {
  console.log("TEST 7 PASSED: Adding review works correctly")
} else {
  console.log("TEST 7 FAILED: Adding review is incorrect")
}

console.log("----------------------------------")

// TEST 8: Add a second Review
reviewProduct.reviews.push({
  user: new mongoose.Types.ObjectId(),
  rating: 3,
  comment: "Good product",
})

reviewProduct.calcAverageRating()
await reviewProduct.save()

console.log("After adding second review:")
console.log("Average Rating:", reviewProduct.averageRating)
console.log("Number of Reviews:", reviewProduct.numReviews)

if (
  reviewProduct.averageRating === 4 &&
  reviewProduct.numReviews === 2
) {
  console.log("TEST 8 PASSED: Multiple reviews calculated correctly")
} else {
  console.log("TEST 8 FAILED: Multiple reviews calculation is incorrect")
}

console.log("----------------------------------")

/// test 9 delete review

const deleteReview= await Product.findOne({
  name: "iPhone 16 Pro Test"
})
   deleteReview.reviews = []
  // deleteReview.reviews=deleteReview.reviews.filter( review => (review.rating!==3))
deleteReview.calcAverageRating()
await deleteReview.save()
console.log("After delete  review:")
console.log("Average Rating:", deleteReview.averageRating)
console.log("Number of Reviews:", deleteReview.numReviews)

if (
  deleteReview.averageRating === 0 &&
  deleteReview.numReviews === 0
) {
  console.log("TEST 9 PASSED: delete review is work")
} else {
  console.log("TEST 9 FAILED: delete review is not work")
}

console.log("----------------------------------")
   
    
  } 
  catch (error) {
    console.error("Test failed:", error.message)
  }
  // Disconnect from MongoDB
    await mongoose.disconnect()

    console.log("MongoDB Disconnected")
};

testProduct();
