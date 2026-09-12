import express from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controllers.js";

import { authentication } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validationMiddleware.js";
import { productIdValidation } from "../validation/wishlist.validation.js";

const wishlistRouter = express.Router();

wishlistRouter.route("/my").get(authentication, getWishlist);

wishlistRouter
  .route("/add/:productId")
  .post(authentication, validate(productIdValidation), addToWishlist);

wishlistRouter
  .route("/remove/:productId")
  .delete(authentication, validate(productIdValidation), removeFromWishlist);

wishlistRouter.route("/clear").delete(authentication, clearWishlist);

export default wishlistRouter;