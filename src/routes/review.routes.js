import express from "express"
import {addReview,getReview,deleteReview} from "../controllers/review.controllers.js"
import  {authentication , restrictTo }  from "../middleware/auth.middleware.js"
import {
  productIdValidation,
  reviewIdValidation,
} from "../validation/review.validation.js";
import { validate } from "../middleware/validationMiddleware.js";

const router= express.Router()

router.post(
  "/:productId/reviews",
  authentication,
  restrictTo("customer"),
  validate(productIdValidation, "params"),
  addReview
);

router.get(
  "/:productId/reviews",
  validate(productIdValidation, "params"),
  getReview
);

router.delete(
  "/:productId/reviews/:reviewId",
  authentication,
  validate(reviewIdValidation, "params"),
  deleteReview
);
// router.post("/:productId/reviews",authentication,addReview)

// router.get("/:productId/reviews",getReview)
// router.delete("/:productId/reviews/:reviewId",authentication,deleteReview)

export default router