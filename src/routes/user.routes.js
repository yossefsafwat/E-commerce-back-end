import express from "express";
import { authentication } from "../middleware/auth.middleware.js";
import { updateProfile, changePassword } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.use(authentication);

userRouter.put("/profile", updateProfile);
userRouter.put("/change-password", changePassword);

export default userRouter;