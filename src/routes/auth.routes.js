import express from "express";
import {
  authentication,
  restrictTo,
} from "../middleware/auth.middleware.js";

import {
  register,
  login,
  logout,
  profile,
  updateProfile,
  changePassword,
  sendOTPForgetPassword,
  verifyOTPForgetPassword,
  adminAddUser,
} from "../controllers/auth.controllers.js";

import {
  sendOTPRegister,
  verfiylogin,
  sendOTPForgetPass,
  verifyOTPForgetPass,
  validateChangePassword,
  validateAdminAddUser,
} from "../middleware/auth.validation.js";

const authRouter = express.Router();

// Public Routes
authRouter.post("/register/send-otp", sendOTPRegister, register);
authRouter.post("/login", verfiylogin, login);
authRouter.post("/forgot-password/send-otp", sendOTPForgetPass, sendOTPForgetPassword);
authRouter.post("/forgot-password/verify-otp", verifyOTPForgetPass, verifyOTPForgetPassword);

// Protected Routes
authRouter.use(authentication);

authRouter.post("/logout", logout);
authRouter.get("/me", profile);
authRouter.put("/me", updateProfile);
authRouter.put("/me/change-password", validateChangePassword, changePassword);

// Admin Routes
authRouter.post("/admin/users", restrictTo("admin"), validateAdminAddUser, adminAddUser);

export default authRouter;