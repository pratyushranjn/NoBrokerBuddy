const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

const onlineUsers = new Map(); // userId => socket.id

module.exports = function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'https://no-broker-buddy.vercel.app'],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware: JWT auth
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  // On client connect
  io.on("connection", (socket) => {
    const user = socket.user;
    const userId = user._id.toString();

    socket.join(userId);

    onlineUsers.set(userId, socket.id);

    console.log(`${user.name} connected [${socket.id}]`);

    io.emit("online-users", Array.from(onlineUsers.keys())); // from Map
    socket.broadcast.emit("user-online", { userId });

    socket.on("join-chat", ({ userId: clientUserId }) => {
      if (clientUserId === userId) {
        socket.join(clientUserId);
        onlineUsers.set(clientUserId, socket.id);
        io.emit("online-users", Array.from(onlineUsers.keys()));
      }
    });

    // Send message
    socket.on("send-message", async ({ receiver, content }) => {
      try {
        const isReceiverOnline = onlineUsers.has(receiver);

        const message = new Message({
          sender: userId,
          receiver,
          content,
          isRead: false,
        });

        await message.save();

        const msgData = {
          _id: message._id,
          sender: userId,
          receiver,
          content,
          createdAt: message.createdAt,
          isRead: message.isRead,
        };

        const receiverSocket = onlineUsers.get(receiver);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive-message", msgData);
        }

        io.to(userId).emit("message-delivered", {
          messageId: message._id,
          to: receiver,
          deliveredAt: new Date(),
        });

        // Dynamically send updated unread count to receiver
        const count = await Message.countDocuments({
          receiver,
          isRead: false,
        });

        io.to(receiver).emit("update-unread-count", {
          unreadMessages: count,
        });

        io.to(receiver).emit("new-message-notification", {
          from: userId,
        });

      } catch (err) {
        console.error("Error sending message:", err.message);
      }
    });


    // Typing indicator
    socket.on("typing", ({ toUserId }) => {
      io.to(toUserId).emit("typing", { from: userId });
    });

    // Mark messages as read
    socket.on("mark-read", async ({ fromUserId }) => {
      try {
        const unreadMessages = await Message.find({
          sender: fromUserId,
          receiver: userId,
          isRead: false,
        });

        const msgIds = unreadMessages.map((msg) => msg._id);

        await Message.updateMany(
          { _id: { $in: msgIds } },
          { $set: { isRead: true } }
        );

        msgIds.forEach((msgId) => {
          io.to(fromUserId).emit("message-read", { msgId }); // update each message
        });

        const count = await Message.countDocuments({
          receiver: userId,
          isRead: false,
        });

        io.to(userId).emit("update-unread-count", {
          unreadMessages: count,
        });

      } catch (err) {
        console.error("Error marking messages as read:", err.message);
      }
    });

    // On disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      // console.log(`${user.name} disconnected`);
      io.emit("online-users", Array.from(onlineUsers.keys()));
      io.emit("user-offline", { userId });
    });
  });
};
