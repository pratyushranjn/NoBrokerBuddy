const Message = require('../models/Message');
const mongoose = require("mongoose");
const User = require("../models/User")


const getChatBetweenUsers = async (req, res) => {
  const { user1, user2 } = req.params;
  const currentUserId = req.user._id.toString();

  if (currentUserId !== user1 && currentUserId !== user2) {
    return res.status(403).json({ message: 'You are not authorized to view this chat.' });
  }

  try {
    const query = {
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    };

    const messages = await Message.find(query).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};


// Get unread message count for a user
const getUnreadCount = async (req, res) => {
  const { userId } = req.params;

  // console.log('Request user:', req.user._id);
  // console.log('Param userId:', userId);

  if (req.user._id.toString() !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const count = await Message.countDocuments({
      receiver: new mongoose.Types.ObjectId(userId), // FIXED
      isRead: false,
    });

    // console.log('Unread count:', count);
    res.json({ count });

  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
};


// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    await Message.updateMany(
      {

        sender: senderId,
        receiver: receiverId,
        isRead: false
      },
      { $set: { isRead: true } }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
};


// Get chat contact list with last message per user
const getChatContacts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const contactsMap = new Map();

    messages.forEach((msg) => {
      const contactId = String(msg.sender) === userId ? String(msg.receiver) : String(msg.sender);
      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, msg);
      }
    });

    const contacts = await Promise.all(
      Array.from(contactsMap.entries()).map(async ([contactId, lastMessage]) => {
        const user = await User.findById(contactId).select("_id name avatar");
        return {
          user,
          lastMessage: lastMessage.content,
          time: lastMessage.createdAt,
        };
      })
    );

    res.json(contacts);
  } catch (err) {
    console.error("Failed to fetch contacts:", err);
    res.status(500).json({ message: "Failed to get contact list" });
  }
};


module.exports = {
  getChatBetweenUsers,
  getUnreadCount,
  markMessagesAsRead,
  getChatContacts
};
