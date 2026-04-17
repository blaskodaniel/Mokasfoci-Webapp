import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { APP_CONFIG } from "@/config";
import { useAuth } from "@/hooks/useAuth";
import { SocketContext } from "./SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { usePopup } from "@/hooks/usePopup";
import type { AppNotification } from "@/models/notification.type";
import { getNotificationTitle } from "@/utils/enums";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const { showInfo } = usePopup();

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

    newSocket.on("new_notification", (notification: AppNotification) => {
      console.log("New notification:", notification);

      showInfo(getNotificationTitle(notification.type), {
        description: notification.text || "Nézd meg a harang ikonra kattintva!",
        autoClose: true,
        duration: 5000,
      });

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, accessToken, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, authError }}>
      {children}
    </SocketContext.Provider>
  );
};
