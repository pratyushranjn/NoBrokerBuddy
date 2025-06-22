const express = require("express");
const router = express.Router();
const {
  getChatBetweenUsers,
  getUnreadCount,
  markMessagesAsRead,
  getChatContacts
} = require("../controllers/messageController");

const { protect } = require("../utils/generateToken");

// Get unread message count
router.get("/unread/count/:userId", protect, getUnreadCount);

// Mark messages as read
router.post("/read/:listingId/:senderId/:receiverId", protect, markMessagesAsRead);

// Get contact list - must come BEFORE user1/user2 **
router.get("/contacts/:userId", protect, getChatContacts);

// Get chat between two users
router.get("/:user1/:user2", protect, getChatBetweenUsers);

module.exports = router;
