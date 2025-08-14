import bcrypt, { hash } from "bcrypt";

import User from "../models/user.js"; // Import your User model

import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();



const generateToken = (id) => {
  console.log("Generating token for admin with ID:", id);
  console.log("JWT Secret:", process.env.JWT_SECRET_KEY);
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

// Store this securely in .env

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Get email & password from frontend

    // 🔹 Step 1: Find user by email
    const user = await User.findOne({ email }).populate("subscription_plan").populate({
      path: "contacts",
      select: "name email phone", // Select only the required fields
    });
    // console.log( "authUser",user);
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 🔹 Step 2: Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 🔹 Step 3: Generate JWT Token
   
    const token =  generateToken(user._id);


    // 🔹 Step 4: Send response with token
    res.status(200).json({
      success: true,
      message: "Login successful",
      user:user,
      token: token,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
