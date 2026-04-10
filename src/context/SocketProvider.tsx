import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { APP_CONFIG } from "@/config";
import { useAuth } from "@/hooks/useAuth";
import { SocketContext } from "./SocketContext";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    // Csak akkor csatlakozunk, ha van bejelentkezett felhasználó
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(APP_CONFIG.SERVER_URL || "", {
      auth: {
        token: accessToken,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      setAuthError(false);
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (err) => {
      const msg = err.message?.toLowerCase() ?? "";
      if (msg.includes("unauthorized") || msg.includes("jwt") || msg.includes("token")) {
        setAuthError(true);
        setIsConnected(false);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, authError }}>{children}</SocketContext.Provider>
  );
};
