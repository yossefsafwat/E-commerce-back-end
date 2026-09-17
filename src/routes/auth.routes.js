import express from "express";
import { authentication ,restrictTo} from "../middleware/auth.middleware.js";

import {
  register,
  login,
  logout,
  profile,
  sendOTPForgetPassword,
  verifyOTPForgetPassword,
  verifyRegisterOTP,
} from "../controllers/auth.controllers.js";

import {
  sendOTPRegister,
  verfiylogin,
  sendOTPForgetPass,
  verifyOTPForgetPass,
  verifyOTPRegister,
} from "../middleware/auth.validation.js";

const authRouter = express.Router();

authRouter.route("/register/send-otp").post(sendOTPRegister, register);
authRouter.route("/verify-otp").post(verifyOTPRegister, verifyRegisterOTP);
authRouter.post("/forgot-password/send-otp",sendOTPForgetPass, sendOTPForgetPassword);
authRouter.post("/forgot-password/verify-otp", verifyOTPForgetPass, verifyOTPForgetPassword);

authRouter.route("/login").post(verfiylogin, login);

authRouter.use(authentication);

authRouter.route("/logout").post(logout);
authRouter.route("/me").get(profile);
// authRouter.put("/me", updateProfile);
// authRouter.put("/me/change-password", validateChangePassword, changePassword);


export default authRouter;
