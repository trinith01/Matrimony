import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js"; // Import MongoDB connection function
import userRouter from "./routes/user_routes.js";
import authRouter from "./routes/auth_routes.js";
import userBoostRouter from "./routes/userBoost_routes.js";
import boostRouter from "./routes/boosPlan_routes.js";
import interestRouter from "./routes/interest_routes.js";
import horoscopeRouter from "./routes/horoscope_routes.js";
import horoscopeRequestRouter from "./routes/horoscope_request_router.js";
import { getHoroscopeUsers } from "./controllers/horoscorpe_controllers.js";
import backGroundCheckRequestsRouter from "./routes/backGrounCheckRequests_Routess.js";
import adminRouter from "./routes/admin_routes.js";
import planRouter from "./routes/plan_routs.js";
import { generatePaymentData } from "./controllers/paymentControllers.js";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./socketHandler.js";
import messageRouter from "./routes/message_routes.js";
import { sendEmail } from "./controllers/user_controllers.js";

// Load environment variables

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server

// ✅ Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Update as needed
    methods: ["GET", "POST"],
  },
});

socketHandler(io); // ✅ Pass the Socket.IO server to the handler




// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/users", userRouter);
app.use("/login", authRouter);
app.use("/boosPlans", boostRouter);
app.use("/userBoost", userBoostRouter);
app.use("/interest", interestRouter);
app.use("/horoscope", horoscopeRouter);
app.use("/horoscopeRequest", horoscopeRequestRouter);
app.get("/hid", getHoroscopeUsers);
app.use("/bgCheckRequests", backGroundCheckRequestsRouter);
app.use("/admin", adminRouter);
app.use("/plan", planRouter);
app.post("/api/payment-data", generatePaymentData);
app.use("/chat" , messageRouter)
app.post("/send-email" , sendEmail)

// Replace app.listen with server.listen to attach the Socket.IO server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
