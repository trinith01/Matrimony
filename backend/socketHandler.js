// socketHandler.js
import Message from "./models/messageModel.js";
const onlineUsers = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId) {
      onlineUsers[userId] = socket.id;
      console.log(`User connected: ${userId} (Socket: ${socket.id})`);
    }

    // socket.on("send_message", async ({ from, to, text }) => {
    //   const targetSocketId = onlineUsers[to];

    //   // Save the message in MongoDB
    //   try {
    //     const newMessage = new Message({ from, to, text });
    //     await newMessage.save();
    //   } catch (error) {
    //     console.error("Failed to save message:", error);
    //   }

    //   // Send message to recipient
    //   if (targetSocketId) {
    //     io.to(targetSocketId).emit("receive_message", { from, text });
    //   }
    // });
    socket.on("send_message", async ({ from, to, text }) => {
      try {
        const newMessage = new Message({ from, to, text, read: false });
        const savedMessage = await newMessage.save();
    
        const targetSocketId = onlineUsers[to];
        if (targetSocketId) {
          io.to(targetSocketId).emit("receive_message", savedMessage); // full message
        }
    
        // Optional: Emit to sender too to confirm save
        const senderSocketId = onlineUsers[from];
        if (senderSocketId) {
          io.to(senderSocketId).emit("message_saved", savedMessage);
        }
      } catch (error) {
        console.error("Failed to save message:", error);
      }
    });
    

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [uid, sid] of Object.entries(onlineUsers)) {
        if (sid === socket.id) {
          delete onlineUsers[uid];
          break;
        }
      }
    });
  });
};

export default socketHandler;
