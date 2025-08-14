import express from "express";
import { getMessages , markMessagesAsRead ,getUnreadMessageCount } from "../controllers/messageControllers.js";

const messageRouter = express.Router();

// get messages
messageRouter.get("/:userId/:recipientId", getMessages);
messageRouter.get("/:userId", getUnreadMessageCount);
messageRouter.patch("/:userId/:recipientId", markMessagesAsRead);

export default messageRouter;