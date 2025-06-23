import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { socket } from "../utils/socket";

const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const connectSocket = (userId) => {
    socket.auth = { token: localStorage.getItem("token") };

    if (!socket.connected) {
      socket.connect();
      socket.on("connect", () => {
        socket.emit("join-chat", { userId });
      });
    } else {
      socket.emit("join-chat", { userId });
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/me`, {
        withCredentials: true,
      });

      setUser(res.data.user);
      connectSocket(res.data.user._id);
    } catch(err) {

      setUser(null);
       console.error("Fetch user failed:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error("Email and password are required");

    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.token) localStorage.setItem("token", res.data.token);

      await fetchUser(); // to update context
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const signup = async ({ name, email, password, confirmPassword }) => {
    if (!name || !email || !password || !confirmPassword)
      throw new Error("All fields are required");
    if (password.length < 5)
      throw new Error("Password must be at least 5 characters");
    if (password !== confirmPassword) throw new Error("Passwords do not match");

    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/register`,
        { name, email, password, confirmPassword },
        { withCredentials: true }
      );
      if (res.data.token) localStorage.setItem("token", res.data.token);
      
      await fetchUser();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Signup failed");
    }
  };

  const logout = async () => {
    await axios.post(
      `${BASE_URL}/api/user/logout`,
      {},
      { withCredentials: true }
    );

    socket.disconnect();

    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
