import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { verifyToken } from "../Utils/jwtConfig.js";
dotenv.config();

const generateToken = (id) => {
  console.log("Generating token for admin with ID:", id);
  console.log("JWT Secret:", process.env.JWT_SECRET_KEY);
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

export const registerAdmin = async (req, res) => {
  console.log("Registering admin...");
  console.log(req.body);
  const { name, email, password } = req.body;

  try {
    // Verify the token to ensure the requester is an authenticated admin
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken)
      return res.status(403).json({ msg: "Access denied. No token provided." });

    //const decoded = verifyToken(authToken);
    if (!decoded)
      return res.status(403).json({ msg: "Access denied. Invalid token." });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ msg: "Admin already exists" });

    // Hash the password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    const newToken = generateToken(newAdmin._id);
    console.log("Token generated:", newToken);
    res.status(201).json({ token: newToken });
    console.log("Admin registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(admin._id);
    res.json({ token: token, admin: admin });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};
