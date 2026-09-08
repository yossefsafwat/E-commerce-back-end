import express from "express";
import { authentication } from "../middleware/auth.middleware.js";
import {
  getOrCreateCart,
  addItemToCart,
} from "../controllers/cart.controllers.js";
import {
 validateAddItemToCart,
  validateUpdateItemQuantity,
  validateApplyCoupon,
} from "../middleware/cart.validation.js";

const cartRouter = express.Router();

// cartRouter.use(authentication);

cartRouter.route("/").get(getOrCreateCart);

cartRouter.route("/items").post(validateAddItemToCart, addItemToCart);



export default cartRouter;
