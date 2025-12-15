import { useState, useEffect, type ReactNode } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCloseOutline,
} from "react-icons/io5";
import type { NotificationItem as NotificationItemType } from "@/state/notificationSlice";

interface NotificationItemProps {
  notification: NotificationItemType;
  onClose: (id: string) => void;
  index: number;
}

const defaultIcons: Record<NotificationItemType["type"], ReactNode> = {
  success: <IoCheckmarkCircleOutline size={24} className="text-green-400" />,
  error: <IoCloseCircleOutline size={24} className="text-red-400" />,
  warning: <IoWarningOutline size={24} className="text-yellow-400" />,
  info: <IoInformationCircleOutline size={24} className="text-blue-400" />,
};

const typeStyles = {
  success: {
    bg: "bg-green-900/20 border-green-500/30",
    accent: "bg-green-500",
    text: "text-green-100",
  },
  error: {
    bg: "bg-red-900/20 border-red-500/30",
    accent: "bg-red-500",
    text: "text-red-100",
  },
  warning: {
    bg: "bg-yellow-900/20 border-yellow-500/30",
    accent: "bg-yellow-500",
    text: "text-yellow-100",
  },
  info: {
    bg: "bg-blue-900/20 border-blue-500/30",
    accent: "bg-blue-500",
    text: "text-blue-100",
  },
};

export const NotificationItem = ({
  notification,
  onClose,
  index,
}: NotificationItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const styles = typeStyles[notification.type];
  const icon = notification.icon || defaultIcons[notification.type];

  useEffect(() => {
    // Delay for staggered animation
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => onClose(notification.id), 300);
  };

  const baseClasses = `
    relative w-96 max-w-sm backdrop-blur-sm rounded-lg border shadow-lg
    transform transition-all duration-500 ease-out pointer-events-auto
    ${styles.bg} ${styles.text}
  `;

  const animationClasses = isRemoving
    ? "translate-x-full opacity-0 scale-95"
    : isVisible
    ? "translate-x-0 opacity-100 scale-100"
    : "translate-x-full opacity-0 scale-95";

  return (
    <div
      className={`${baseClasses} ${animationClasses}`}
      style={{
        transformOrigin: "right center",
      }}
    >
      {/* Progress bar */}
      {notification.autoClose && notification.duration && (
        <div className="absolute top-0 left-0 h-1 bg-gray-700 rounded-t-lg overflow-hidden">
          <div
            className={`h-full ${styles.accent} transform origin-left animate-progress`}
            style={{
              animation: `progress ${notification.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 mt-0.5">{icon}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm leading-5">
              {notification.title}
            </div>

            {notification.subtitle && (
              <div className="text-xs text-gray-300 mt-1">
                {notification.subtitle}
              </div>
            )}

            {notification.description && (
              <div className="text-xs text-gray-400 mt-2 leading-4">
                {notification.description}
              </div>
            )}

            {/* Actions */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {notification.actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    onClick={action.onClick}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                      ${
                        action.variant === "primary"
                          ? `${styles.accent} text-white hover:opacity-80`
                          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <IoCloseOutline size={18} className="text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
