import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    //await mongoose.connect("mongodb+srv://harithmaduranga:Harith123LankaWed@cluster0.ss8o8.mongodb.net/matrimony?retryWrites=true&w=majority&appName=Cluster0");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
