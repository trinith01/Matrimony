import { createRequest , deleteRequest , updateRequest , getAllRequests , getRequestById, getRequestByUserId}from "../controllers/backGroundCheckReqeusts_Controllers.js";
import express from "express";

const backGroundCheckRequestsRouter = express.Router();
backGroundCheckRequestsRouter.post("/", createRequest);
backGroundCheckRequestsRouter.get("/", getAllRequests); 
backGroundCheckRequestsRouter.get("/:id", getRequestById);
backGroundCheckRequestsRouter.delete("/:id", deleteRequest);
backGroundCheckRequestsRouter.put("/:id", updateRequest);
backGroundCheckRequestsRouter.get("/user/:userId", getRequestByUserId); // Get requests by user ID

export default backGroundCheckRequestsRouter;