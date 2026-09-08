// import express from "express";
// import { authentication } from "../middleware/auth.middleware.js";
// import {
//   register,
//   verifyOTP,
//   forgetPassword,
//   resetPassword,
//   login,
//   logout,
//   profile,
// } from "../controllers/auth.controllers.js";
// import {
//   sendOTPRegister,
//   verifyOTPRegister,
//   sendOTPForgetPass,
//   verifyOTPForgetPass,
//   verfiylogin,
// } from "../middleware/auth.validation.js";

// const authRouter = express.Router();

// authRouter.route("/register/send-otp").post(sendOTPRegister, register);
// authRouter.route("/verify-otp").post(verifyOTPRegister, verifyOTP);
// authRouter
//   .route("/forgot-password/send-otp")
//   .post(sendOTPForgetPass, forgetPassword);
// authRouter
//   .route("/forgot-password/verify-otp")
//   .post(verifyOTPForgetPass, resetPassword);
// authRouter.route("/login").post(verfiylogin, login);

// authRouter.use(authentication);

// authRouter.route("/logout").post(logout);
// authRouter.route("/me").get(profile);

// export default authRouter;





import express from "express";
import { authentication } from "../middleware/auth.middleware.js";

import {
  register,
  login,
  logout,
  profile,
} from "../controllers/auth.controllers.js";

import {
  sendOTPRegister,
  verifyOTPRegister,
  sendOTPForgetPass,
  verifyOTPForgetPass,
  verfiylogin,
} from "../middleware/auth.validation.js";

const authRouter = express.Router();

authRouter.route("/register/send-otp").post(sendOTPRegister, register);

authRouter.route("/login").post(verfiylogin, login);

authRouter.use(authentication);

authRouter.route("/logout").post(logout);
authRouter.route("/me").get(profile);

export default authRouter;
