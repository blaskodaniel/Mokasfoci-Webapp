import { useEffect, useRef } from "react";
import { useAppSelector } from "@/state/hooks";
import { useNotification } from "@/hooks/useNotification";
import { NotificationItem } from "./NotificationItem";

const NotificationContainer = () => {
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );
  const { hideNotification } = useNotification();
  const timeoutRefs = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const timeouts = timeoutRefs.current;

    notifications.forEach((notification) => {
      if (
        notification.autoClose &&
        notification.duration &&
        !timeouts.has(notification.id)
      ) {
        const timeout = setTimeout(() => {
          hideNotification(notification.id);
          timeouts.delete(notification.id);
        }, notification.duration);

        timeouts.set(notification.id, timeout);
      }
    });

    // Cleanup timeouts for removed notifications
    const currentIds = new Set(notifications.map((n) => n.id));
    timeouts.forEach((timeout, id) => {
      if (!currentIds.has(id)) {
        clearTimeout(timeout);
        timeouts.delete(id);
      }
    });

    // Cleanup on unmount
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, [notifications, hideNotification]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={hideNotification}
          index={index}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
