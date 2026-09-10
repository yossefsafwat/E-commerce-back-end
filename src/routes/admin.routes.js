import express from "express";
import {
  getDashboardStats,
  getActiveCarts,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/admin.controllers.js";
import { authentication, restrictTo } from "../middleware/auth.middleware.js";
import { validateUpdateOrderStatus } from "../middleware/order.middleware.js";
const adminRouter = express.Router();

// adminRouter.use(authentication);
// adminRouter.use(restrictTo("admin"));

adminRouter.get("/dashboard", getDashboardStats);

adminRouter.get("/carts", getActiveCarts);

adminRouter.get("/", getAllOrders);

adminRouter.get("/:id", getSingleOrder);

adminRouter.patch("/:id/status", validateUpdateOrderStatus, updateOrderStatus);

export default adminRouter;
