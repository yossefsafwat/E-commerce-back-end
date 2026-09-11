import User from "../models/User.model.js";
import OTP from "../models/OTP.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "../utils/email.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), ".env") });

// LOGIN
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(404).json({
        success: false,
        message: "Email or Password is not correct",
      });
    }

    let token = jwt.sign(
      {
        _id: user._id.toString(),
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

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

// REGISTER
const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let duplicatedEmail = await User.findOne({ email: normalizedEmail });

    if (duplicatedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    let newUser = new User({
      username,
      email: normalizedEmail,
      password,
      phone,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error creating user: ${error.message}`,
    });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error during logout: ${error.message}`,
    });
  }
};

// GET PROFILE
const profile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, phone, avatar, addresses } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (username !== undefined) user.username = username;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (addresses !== undefined) user.addresses = addresses;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error updating profile: ${error.message}`,
    });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcryptjs.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error changing password: ${error.message}`,
    });
  }
};

// ADMIN ADD USER
const adminAddUser = async (req, res) => {
  try {
    const { username, email, password, phone, avatar, role, addresses } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const newUser = new User({
      username,
      email: normalizedEmail,
      password,
      phone,
      avatar,
      role: role || "customer",
      addresses,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        role: newUser.role,
        isVerified: newUser.isVerified,
        addresses: newUser.addresses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error creating user: ${error.message}`,
    });
  }
};

// FORGOT PASSWORD - SEND OTP
const sendOTPForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    await OTP.deleteMany({ email: normalizedEmail });

    const { otpDocument, otp } = await OTP.createOTP(
      normalizedEmail,
      { userId: user._id.toString() },
      5
    );

    const emailResult = await sendEmail(
      normalizedEmail,
      "Password Recovery OTP",
      "resetPassword-template.hbs",
      {
        name: user.username,
        otpCode: otp,
        otpExpiry: 5,
        subject: "Password Recovery OTP",
      }
    );

    if (!emailResult.success) {
      await OTP.deleteOne({ _id: otpDocument._id });

      return res.status(500).json({
        success: false,
        message: "Failed to send password recovery email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password recovery OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error while sending password recovery OTP: ${error.message}`,
    });
  }
};

// FORGOT PASSWORD - VERIFY OTP & RESET
const verifyOTPForgetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const otpDocument = await OTP.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });

    if (!otpDocument) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (!otpDocument.isValid()) {
      await OTP.deleteOne({ _id: otpDocument._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const isOTPValid = await otpDocument.compareOTP(otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteOne({ _id: otpDocument._id });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error while resetting password: ${error.message}`,
    });
  }
};

export {
  login,
  register,
  profile,
  updateProfile,
  changePassword,
  adminAddUser,
  logout,
  sendOTPForgetPassword,
  verifyOTPForgetPassword,
};