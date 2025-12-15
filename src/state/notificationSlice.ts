import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ReactNode } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  type: NotificationType;
  duration?: number; // milliseconds
  icon?: ReactNode;
  autoClose?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
}

interface NotificationState {
  notifications: NotificationItem[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<NotificationItem, "id">>
    ) => {
      const notification: NotificationItem = {
        id: `notification_${Date.now()}_${Math.random()}`,
        duration: 3000,
        autoClose: true,
        ...action.payload,
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    updateNotification: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<NotificationItem> }>
    ) => {
      const index = state.notifications.findIndex(
        (n) => n.id === action.payload.id
      );
      if (index !== -1) {
        state.notifications[index] = {
          ...state.notifications[index],
          ...action.payload.updates,
        };
      }
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  updateNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
