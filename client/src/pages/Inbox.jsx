import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { socket } from "../utils/socket";
import { Trash2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const Inbox = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {

    if (!user?._id) return;

    socket.emit("join-chat", { userId: user._id });

    socket.on("online-users", (ids) => setOnlineUsers(ids));

    return () => {
      socket.off("online-users");
    };
  }, [user]);


  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/messages/contacts/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
        setContacts(res.data);
      } catch (err) {
        console.error("Failed to load inbox contacts", err);
      }
    };

    if (user?._id) fetchContacts();
  }, [user]);

  const isUserOnline = (id) => onlineUsers.includes(id);

  const activeContacts = contacts.filter((c) => c.user);
  const deletedContacts = contacts.filter((c) => !c.user);

  return (

    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Chats</h2>

          {contacts.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              
              {/* Active Contacts */}
              {activeContacts.map(({ user: contactUser, lastMessage, time, unread }) => (
                <li key={contactUser._id}>
                  <Link
                    to={`/chat/${contactUser._id}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 transition rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center text-sm">
                          {contactUser.name?.charAt(0).toUpperCase()}
                        </div>
                        {isUserOnline(contactUser._id) && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
                        )}
                      </div>
                      <div className="max-w-[180px] sm:max-w-[220px]">
                        <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                          {contactUser.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 truncate">
                          <span>{lastMessage}</span>
                          {unread > 0 && (
                            <span className="ml-2 text-red-600 font-bold">•</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                      <span>{formatDistanceToNow(new Date(time), { addSuffix: true })}</span>
                      {unread === 0 && <span className="text-green-500">✓✓</span>}
                    </div>
                  </Link>
                </li>
              ))}

              {/* Grouped Deleted Chats */}
              {deletedContacts.length > 0 && (
                <li className="flex items-center justify-between p-3 text-gray-400 italic bg-gray-50 rounded-md mt-2">
                  <div className="flex items-center gap-2">
                    <Trash2 size={18} className="text-gray-400" />
                    <span>{deletedContacts.length} Deleted Chat {deletedContacts.length > 1 ? "s" : ""}</span>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="p-3 text-center border-t border-blue-100 bg-blue-100 text-blue-700 text-sm sm:text-base">
        💡 Visit a listing's details page to message the person who posted it.
      </div>
    </div>
  );
};

export default Inbox;






