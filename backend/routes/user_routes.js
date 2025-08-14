import express from "express";
import getSortedUsers, { deleteUser, updateUserProfile, updateUserProfileView }  from "../controllers/user_controllers.js";
import { createUser } from "../controllers/user_controllers.js";
import { getUserWithId } from "../controllers/user_controllers.js";
import { verifyOTP } from "../controllers/user_controllers.js";

const userRouter = express.Router();

userRouter.route('/').get(getSortedUsers).post(createUser);
userRouter.route('/:id').get(getUserWithId).delete(deleteUser);
userRouter.route("/:id").put(updateUserProfileView)
userRouter.route("/updateProfile/:id").put(updateUserProfile);
userRouter.post("/verify-otp", verifyOTP);


export default userRouter;
