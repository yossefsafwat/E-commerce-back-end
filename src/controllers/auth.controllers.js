import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: `you must send all fields are required`,
      });

    let user = await User.findOne({ email });
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

    res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      user,
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

//note register need send otp
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: `you must send all fields are required`,
      });
    }
    let deplicatedEmail = await User.findOne({ email });
    if (deplicatedEmail) {
      return res.status(400).json({
        success: false,
        message: `Email is already exists`,
      });
    }

    let newUser = new User({
      username,
      email,
      password,
    });
    //logic to send otp register in  email
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: `user created successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error from create user ${error.message}`,
    });
  }
};

export { login, register, profile, logout };
