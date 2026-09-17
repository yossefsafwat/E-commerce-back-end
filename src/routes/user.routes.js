import express from "express";

import {
  authentication,
  restrictTo,
} from "../middleware/auth.middleware.js";

import {
  adminAddUser,
  adminGetAllUsers,
  adminGetUserById,
  adminDeleteUser,
} from "../controllers/admin.user.controllers.js";

import {
  updateProfile,
} from "../controllers/user.controllers.js";

const userRouter = express.Router();

// ===============================
// ADMIN USER MANAGEMENT
// ===============================

// Add a new user
userRouter.post(
  "/add",
  authentication,
  restrictTo("admin"),
  adminAddUser
);

// Get all users
userRouter.get(
  "/all",
  authentication,
  restrictTo("admin"),
  adminGetAllUsers
);

// Get one user by ID
userRouter.get(
  "/:id",
  authentication,
  restrictTo("admin"),
  adminGetUserById
);

// Delete one user
userRouter.delete(
  "/:id",
  authentication,
  restrictTo("admin"),
  adminDeleteUser
);

// ===============================
// NORMAL USER OPERATIONS
// ===============================

// Update own user data
userRouter.patch(
  "/:id",
  authentication,
  restrictTo("customer"),
  updateProfile
);

// Update profile using /profile
// userRouter.put(
//   "/profile",
//   authentication,
//   updateProfile
// );

// // Change password
// userRouter.put(
//   "/change-password",
//   authentication,
//   changePassword
// );

export default userRouter;




// import express from "express";
// import { authentication } from "../middleware/auth.middleware.js";
// import { updateProfile, changePassword } from "../controllers/user.controllers.js";

// const userRouter = express.Router();

// userRouter.use(authentication);

// userRouter.put("/profile", updateProfile);
// userRouter.put("/change-password", changePassword);

// export default userRouter;