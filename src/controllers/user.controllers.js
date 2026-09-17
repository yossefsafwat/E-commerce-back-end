import User from "../models/User.model.js";
// import bcryptjs from "bcryptjs";
import {
  updateUserSchema,
  // changePasswordSchema,
} from "../validation/user.updatevalidation.js";

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
        if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own account",
      });
    }
    const { error } = updateUserSchema.validate(req.body);

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

    const { username, email, phone, avatar, addresses } = req.body;

    // Check if email is already used by another user
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another user",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(username !== undefined && { username }),
        ...(email !== undefined && { email: email.toLowerCase() }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
        ...(addresses !== undefined && { addresses }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        addresses: updatedUser.addresses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to update profile: ${error.message}`,
    });
  }
};
export {
  updateProfile,
  // changePassword,
};

// // CHANGE PASSWORD
// const changePassword = async (req, res) => {
//   try {
//     const { error } = changePasswordSchema.validate(req.body);

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

//     const { currentPassword, newPassword } = req.body;

//     const user = await User.findById(req.user._id).select("+password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Check current password
//     const isPasswordCorrect = await bcryptjs.compare(
//       currentPassword,
//       user.password
//     );

//     if (!isPasswordCorrect) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     // Prevent using the same password
//     const isSamePassword = await bcryptjs.compare(
//       newPassword,
//       user.password
//     );

//     if (isSamePassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New password must be different from current password",
//       });
//     }

//     user.password = newPassword;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Error changing password: ${error.message}`,
//     });
//   }
// };




// import User from "../models/User.model.js";
// import bcryptjs from "bcryptjs";
// import { updateUserSchema, changePasswordSchema } from "../validation/user.updatevalidation.js";


// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { username, phone, avatar, addresses } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (username !== undefined) user.username = username;
//     if (phone !== undefined) user.phone = phone;
//     if (avatar !== undefined) user.avatar = avatar;
//     if (addresses !== undefined) user.addresses = addresses;

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
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
//       message: `Error updating profile: ${error.message}`,
//     });
//   }
// };

// // CHANGE PASSWORD
// export const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const user = await User.findById(req.user._id).select("+password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const isPasswordCorrect = await bcryptjs.compare(
//       currentPassword,
//       user.password
//     );

//     if (!isPasswordCorrect) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     user.password = newPassword;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Error changing password: ${error.message}`,
//     });
//   }
// };

// // Profile update
// const updateProfile = async (req, res) => {
//   try {
//     const { error } = updateUserSchema.validate(req.body);

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

//     const { username, email, phone, avatar } = req.body;

//     // Check if email is already used by another user
//     if (email) {
//       const existingUser = await User.findOne({
//         email: email.toLowerCase(),
//         _id: { $ne: req.user._id },
//       });

//       if (existingUser) {
//         return res.status(400).json({
//           success: false,
//           message: "Email is already in use by another user",
//         });
//       }
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         ...(username !== undefined && { username }),
//         ...(email !== undefined && { email: email.toLowerCase() }),
//         ...(phone !== undefined && { phone }),
//         ...(avatar !== undefined && { avatar }),
//       },
//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: {
//         _id: updatedUser._id,
//         username: updatedUser.username,
//         email: updatedUser.email,
//         phone: updatedUser.phone,
//         avatar: updatedUser.avatar,
//         role: updatedUser.role,
//         isVerified: updatedUser.isVerified,
//         addresses: updatedUser.addresses,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Failed to update profile: ${error.message}`,
//     });
//   }
// };

// // Change password
// const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide both current and new password",
//       });
//     }

//     const user = await User.findById(req.user._id).select("+password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // التحقق من صحة كلمة المرور الحالية
//     const isPasswordCorrect = await user.comparePassword(currentPassword);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     // منع إعادة استخدام نفس كلمة المرور القديمة
//     const isSamePassword = await user.comparePassword(newPassword);
//     if (isSamePassword) {
//       return res.status(400).json({
//         success: false,
//         message: "New password must be different from current password",
//       });
//     }

//     // إسناد كلمة المرور الجديدة 
//     user.password = newPassword;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Error changing password: ${error.message}`,
//     });
//   }
// };

// export {
//   updateProfile,
//   changePassword,
// };
