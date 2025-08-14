import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Secret key should be loaded from the environment
  const secretKey = process.env.JWT_SECRET_KEY;


export const generateToken = async (user) => {
  const payload = {
    id: user._id,        // MongoDB User ID
    email: user.email,   // User Email
  };
  console.log("token" ,jwt.sign(payload, secretKey, { expiresIn: "1h" }));

  // Generate and return the JWT token with an expiration time of 1 hour
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};
