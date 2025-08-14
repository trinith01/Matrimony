import express from "express";
import Message from "../models/messageModel.js";
import mongoose from "mongoose";

// Fetch chat history between two users
export const getMessages = async (req, res) => {
  try {
    const { userId, recipientId } = req.params;
    const messages = await Message.find({
      $or: [
        { from: userId, to: recipientId },
        { from: recipientId, to: userId },
      ],
    }).sort({ timestamp: 1 });

    const count = await Message.countDocuments({
      to: userId,
      read: false,
    });
    res.json({ messages, count });

    

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chat history" });
  }
};


// Count unread messages for a specific user
export const getUnreadMessageCount = async (req, res) => {
   try {
    const { userId } = req.params;
    console.log("Fetching unread messages for userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId:", userId);
      return res.status(400).json({ message: "Invalid userId" });
    }



    const count = await Message.countDocuments({
      to: userId,
      read: false,
    });

    res.json( count );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching unread message count" });
  }
};

// PATCH /chat/mark-read
export const markMessagesAsRead = async (req, res) => {
  console.log("Marking messages as read");
  const { userId, recipientId } = req.params;
  console.log("userId:", userId, "recipientId:", recipientId);

  try {
    await Message.updateMany(
      { to: userId, from: recipientId, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "Marked as read" });
    console.log("Marked messages as read for userId:", userId, "and recipientId:", recipientId);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};
