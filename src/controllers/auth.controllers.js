import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import OTP from "../models/OTP.model.js";
import { sendEmail, formatDate } from "../utils/email.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: `you must send all fields are required`,
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: `Email is already exists`,
      });
    }

    const userData = { username, email, password, phone };
    const otpCodeDoc = await OTP.createOTP(email, userData);
    const OTPuser = new OTP(otpCodeDoc);
    if (OTPuser.isValid()) {
      await OTPuser.save();
      const { success } = await sendEmail(
        email,
        "Verify Your Email Address",
        "sendOTP-template.hbs",
        {
          name: username,
          otpCode: otpCodeDoc.otp,
          otpExpiry: 5,
        },
      );
      if (success) {
        return res.status(200).json({
          success: true,
          message: `send OTP to your ${email} `,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: `failed in send OTP to your ${email} `,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `otp is expired`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in send OTP ${error.message}`,
    });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: `you must send all fields are required`,
      });

    let user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(404).json({
        success: false,
        message: `Email or Password is not correct`,
      });

    let userPasswrod = await bcryptjs.compare(password, user.password);
    if (!userPasswrod)
      return res.status(404).json({
        success: false,
        message: `Email or Password is not correct`,
      });

    let token = jwt.sign(
      { _id: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        wishlist: user.wishlist,
        isVerified: user.isVerified,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `error during logout: ${error.message} `,
    });
  }
};

const profile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};



export { login, register, profile, logout };
