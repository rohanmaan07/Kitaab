import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from '../config/api';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (userId && token) {
      const newSocket = io(SOCKET_URL, {
        query: {
          userId,
          token  // Add token for authentication
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected successfully!");
        setIsConnected(true);
        setSocket(newSocket);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected!");
        setIsConnected(false);
        setSocket(null);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        setIsConnected(false);
      });

      newSocket.on("user_online", (data) => {
        setOnlineUsers((prev) => [...new Set([...prev, data.userId])]);
      });

      newSocket.on("user_offline", (data) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
      });

      return () => {
        console.log("Cleaning up socket connection");
        try {
          newSocket.off();
          newSocket.close();
        } catch (e) {
          // ignore
        }
        setIsConnected(false);
        setSocket(null);
      };
    } else {
      console.log("No token or userId found, skipping socket connection");
      setIsConnected(false);
    }
  }, []); // Empty dependency - only run once on mount

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
