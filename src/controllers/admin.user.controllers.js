import User from "../models/User.model.js";
import {
  adminAddUserSchema,
  // adminUpdateUserSchema,
} from "../validation/admin.user.validation.js";

// Admin add User
const adminAddUser = async (req, res) => {
  try {
    const { error, value } = adminAddUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        })),
      });
    }

    const {
      username,
      email,
      password,
      phone,
      avatar,
      role,
      isVerified,
      addresses,
    } = value;

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password,
      phone,
      avatar,
      role,
      isVerified,
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
      message: `Failed to create user: ${error.message}`,
    });
  }
};

// Admin get all Users
const adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to get users: ${error.message}`,
    });
  }
};

// Admin get User by ID
const adminGetUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to get user: ${error.message}`,
    });
  }
};

// Admin update User
// const adminUpdateUser = async (req, res) => {
//   try {
//     const { error, value } = adminUpdateUserSchema.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: error.details.map((err) => ({
//           field: err.context.key,
//           message: err.message,
//         })),
//       });
//     }

//     const { id } = req.params;

//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (value.email) {
//       const existingUser = await User.findOne({
//         email: value.email.toLowerCase(),
//         _id: { $ne: id },
//       });

//       if (existingUser) {
//         return res.status(400).json({
//           success: false,
//           message: "Email is already in use by another user",
//         });
//       }

//       value.email = value.email.toLowerCase();
//     }

//     Object.assign(user, value);

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         phone: user.phone,
//         avatar: user.avatar,
//         role: user.role,
//         isVerified: user.isVerified,
//         addresses: user.addresses,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Failed to update user: ${error.message}`,
//     });
//   }
// };

// Admin delete User
const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete their own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to delete user: ${error.message}`,
    });
  }
};

export {
  adminAddUser,
  adminGetAllUsers,
  adminGetUserById,
  // adminUpdateUser,
  adminDeleteUser,
};