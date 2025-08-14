import { generatePaymentData } from "../controllers/paymentControllers.js";
import express from "express";
const paymentRouter = express.Router();

paymentRouter.post("/payment-data", generatePaymentData);