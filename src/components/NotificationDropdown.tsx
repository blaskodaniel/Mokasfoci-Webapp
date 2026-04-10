import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useNotifications, useMarkNotificationAsRead } from "@/hooks/api/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { hu } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useNotifications(1, 20);
  const markAsRead = useMarkNotificationAsRead();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string, read: boolean) => {
    if (!read) {
      markAsRead.mutate(id);
    }
  };

  const unreadCount = data?.unreadCount || 0;
  const notifications = data?.notifications || [];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-white hover:text-yellow-300 transition-colors focus:outline-none"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold leading-none text-white transform bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 sm:-right-4 mt-2 w-80 bg-gray-900 border border-gray-700 shadow-xl rounded-xl overflow-hidden z-50"
          >
            <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Értesítések</h3>
              <span className="text-xs text-gray-400">{unreadCount} olvasatlan</span>
            </div>

            <div className="max-h-[350px] overflow-y-auto scrollbar-hide bg-gray-900">
              {isLoading ? (
                <div className="p-4 text-center text-gray-400 text-sm">Betöltés...</div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  Nincs olvasatlan új üzeneted.
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif._id, notif.read)}
                      className={`p-3 border-b border-gray-800 cursor-pointer transition-colors hover:bg-gray-800/50 ${!notif.read ? "bg-gray-800/30" : ""}`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span
                          className={`text-sm ${!notif.read ? "font-bold text-white" : "font-medium text-gray-300"}`}
                        >
                          {notif.type === "system" ? "Rendszerüzenet" : "Értesítés"}
                        </span>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(notif.createdAt), {
                            addSuffix: true,
                            locale: hu,
                          })}
                        </span>
                      </div>
                      <p
                        className={`text-xs ${!notif.read ? "text-gray-300" : "text-gray-500"} line-clamp-2`}
                      >
                        {notif.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-2 bg-gray-800 border-t border-gray-700 border-b-0 text-center">
              <Link
                to="/notification"
                onClick={() => setIsOpen(false)}
                className="text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors inline-block w-full py-1"
              >
                Összes üzenet megtekintése
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
