import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { socket } from "../utils/socket.js";
import { useNotifications } from "../context/NotificationContext.jsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatBox = ({ user, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);

  const { setUnreadCount } = useNotifications();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  const handleTyping = () => {
    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", { toUserId: receiver._id });
    }, 200);
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/messages/${user._id}/${receiver._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const formatted = res.data.map((msg) => ({
          id: msg._id,
          sender: msg.sender === user._id ? "me" : "other",
          content: msg.content,
          isRead: msg.isRead,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setMessages(formatted);
        scrollToBottom();
      } catch (err) {
        console.error("Can't load messages:", err);
      }
    };

    if (user && receiver) {
      fetchMessages();
    }
  }, [user, receiver]);


  // Socket IO
  useEffect(() => {
    if (!user || !receiver) return;

    const setupSocket = () => {
      if (!socket.connected) {
        socket.auth = { token: localStorage.getItem("token") };
        socket.connect();
        socket.once("connect", () => {
          socket.emit("join-chat", { userId: user._id });
        });
      } else {
        socket.emit("join-chat", { userId: user._id });
      }
    };

    setupSocket();

    socket.on("online-users", (onlineUserIds) => {
      setIsOnline(onlineUserIds.includes(receiver._id));
    });

    socket.on("user-online", ({ userId }) => {
      if (userId === receiver._id) setIsOnline(true);
    });

    socket.on("user-offline", ({ userId }) => {
      if (userId === receiver._id) setIsOnline(false);
    });

    socket.on("receive-message", (msg) => {
      const fromMe = String(msg.sender) === String(user._id);
      const toMe = String(msg.receiver) === String(user._id);

      const isActiveChat =
        [msg.sender, msg.receiver].includes(user._id) &&
        [msg.sender, msg.receiver].includes(receiver._id);

      if (!isActiveChat) return;

      const isChatOpen =
        document.hasFocus() &&
        receiver &&
        String(receiver._id) === String(msg.sender);

      if (toMe && isChatOpen) {
        socket.emit("mark-read", { fromUserId: msg.sender });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: msg._id,
          sender: fromMe ? "me" : "other",
          content: msg.content,
          isRead: msg.isRead,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    socket.on("message-read", ({ msgId }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === msgId ? { ...msg, isRead: true } : msg))
      );
    });

    socket.on("typing", ({ from }) => {
      if (from === receiver._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1000);
      }
    });

    socket.on("update-unread-count", ({ unreadMessages }) => {
      setUnreadCount(unreadMessages);
    });


    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("user-online");
      socket.off("user-offline");
      socket.off("online-users");
      socket.off("message-read");
      socket.off("update-unread-count");
    };
  }, [user, receiver]);

  // Mark read if messages already loaded and tab is focused
  useEffect(() => {
    const hasUnreadFromReceiver = messages.some(
      (m) => m.sender === "other" && !m.isRead
    );

    if (document.hasFocus() && receiver && hasUnreadFromReceiver) {
      socket.emit("mark-read", { fromUserId: receiver._id });
    }
  }, [messages, receiver]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const tempId = Date.now();

    const newMessage = {
      id: tempId,
      sender: "me",
      content: message,
      isRead: false,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit("send-message", {
      receiver: receiver._id,
      content: message,
    });

    setMessage("");
    scrollToBottom();
  };

  return (
    <>
      <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}

        <div className="bg-indigo-600 text-white p-4 flex items-center">

          <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-lg font-bold">
            {receiver.name.charAt(0)}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold">{receiver.name}</h3>
            <p className="text-xs opacity-80 flex items-center gap-1">
              {isTyping ? (
                "Typing..."
              ) : isOnline ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                  <span>Online</span>
                </>
              ) : (
                "Offline"
              )}
            </p>
          </div>

        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-4 ${msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === "me"
                  ? "bg-indigo-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
              >
                <p>{msg.content}</p>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span
                    className={`${msg.sender === "me" ? "text-indigo-100" : "text-gray-500"
                      }`}
                  >
                    {msg.time}
                  </span>
                  {msg.sender === "me" && (
                    <span
                      className={`${msg.isRead ? "text-blue-400" : "text-gray-400"
                        }`}
                    >
                      {msg.isRead ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t p-3 bg-white">
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // socket.emit("typing", { toUserId: receiver._id });
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition px-4"
              disabled={!message.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>

    </>
  );
};

export default ChatBox;









