import { loginUser } from "../controllers/login_controller.js";
import express from "express";

const authRouter = express.Router();

// Define the login route to handle POST requests to '/login'
authRouter.route('/').post(loginUser);

export default authRouter;