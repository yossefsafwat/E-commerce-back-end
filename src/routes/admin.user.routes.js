import express from "express";
import { authentication, restrictTo } from "../middleware/auth.middleware.js";
import {
  adminAddUser,
  adminGetAllUsers,
  adminGetUserById,
  adminUpdateUser,
  adminDeleteUser,
} from "../controllers/admin.user.controllers.js";

const adminUserRouter = express.Router();

// صلاحيات admin
adminUserRouter.use(authentication, restrictTo("admin"));

adminUserRouter
  .route("/")
  .post(adminAddUser)
  .get(adminGetAllUsers);

adminUserRouter
  .route("/:id")
  .get(adminGetUserById)
  .put(adminUpdateUser)
  .delete(adminDeleteUser);

export default adminUserRouter;