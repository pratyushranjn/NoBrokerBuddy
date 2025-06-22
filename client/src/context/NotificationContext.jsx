import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { socket } from '../utils/socket';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchUnreadCount = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/messages/unread/count/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Fetch on user change
  useEffect(() => {
    if (user && user._id) {
      fetchUnreadCount(user._id);
    } else {
      setUnreadCount(0); 
    }
  }, [user]); // 👈 this is key
  

  // Live socket unread count listener
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = ({ unreadMessages }) => {
      setUnreadCount(unreadMessages);
    };

    socket.on('update-unread-count', handleUpdate);

    return () => {
      socket.off('update-unread-count', handleUpdate);
    };
  }, []);

  const resetUnread = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, fetchUnreadCount, resetUnread, setUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
