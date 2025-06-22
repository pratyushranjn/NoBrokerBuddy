import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import ChatBox from "../routes/ChatBox";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatPage = () => {
  const { user } = useAuth();
  const { receiverId } = useParams();
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setReceiver(res.data);
      } catch (err) {
        console.error("Failed to load receiver:", err);
      }
    };

    if (receiverId) fetchReceiver();
  }, [receiverId]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Please login to continue</p>
      </div>
    );
  }

  if (!receiver) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-4">Chat</h2>
        <div className="border rounded-lg shadow p-4">

          <ChatBox user={user} receiver={receiver} />
          
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
