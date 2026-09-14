import express from "express";
import { authentication } from "../middleware/auth.middleware.js";
import {
  getOrCreateCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  applyCoupon,
  removeCoupon,
  clearCart
} from "../controllers/cart.controllers.js";
import {
 validateAddItemToCart,
  validateUpdateItemQuantity,
  validateApplyCoupon,
} from "../middleware/cart.validation.js";

const cartRouter = express.Router();

cartRouter.use(authentication);

cartRouter.route("/").get(getOrCreateCart);

cartRouter.route("/items").post(validateAddItemToCart, addItemToCart);

cartRouter.route("/items").patch(validateUpdateItemQuantity, updateCartItemQuantity);

cartRouter.route("/items/:productId").delete(removeItemFromCart);

cartRouter.route("/coupon").post(validateApplyCoupon,applyCoupon);

cartRouter.route("/coupon").delete(removeCoupon);

cartRouter.route("/clear").delete(clearCart);

export default cartRouter;
