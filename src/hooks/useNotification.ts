import { useCallback, type ReactNode } from "react";
import { useAppDispatch } from "@/state/hooks";
import {
  addNotification,
  removeNotification,
  clearAllNotifications,
  type NotificationItem,
  type NotificationType,
} from "@/state/notificationSlice";

export interface ShowNotificationOptions {
  title: string;
  subtitle?: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
  icon?: ReactNode;
  autoClose?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
}

export const useNotification = () => {
  const dispatch = useAppDispatch();

  const showNotification = useCallback(
    (options: ShowNotificationOptions) => {
      const notificationData: Omit<NotificationItem, "id"> = {
        type: "info",
        duration: 3000,
        autoClose: true,
        ...options,
      };

      dispatch(addNotification(notificationData));
    },
    [dispatch]
  );

  const hideNotification = useCallback(
    (id: string) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearAllNotifications());
  }, [dispatch]);

  // Convenience methods for different types
  const showSuccess = useCallback(
    (title: string, options?: Omit<ShowNotificationOptions, "title" | "type">) => {
      showNotification({ title, type: "success", ...options });
    },
    [showNotification]
  );

  const showError = useCallback(
    (title: string, options?: Omit<ShowNotificationOptions, "title" | "type">) => {
      showNotification({ title, type: "error", duration: 5000, ...options });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title: string, options?: Omit<ShowNotificationOptions, "title" | "type">) => {
      showNotification({ title, type: "warning", duration: 4000, ...options });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, options?: Omit<ShowNotificationOptions, "title" | "type">) => {
      showNotification({ title, type: "info", ...options });
    },
    [showNotification]
  );

  return {
    showNotification,
    hideNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
