import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { hu } from "date-fns/locale";
import { FaTrash, FaCheck, FaCheckDouble } from "react-icons/fa";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/hooks/api/useNotifications";
import Button from "@/components/Button";

const NotificationsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useNotifications(page, limit);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();
  const deleteAllNotifications = useDeleteAllNotifications();

  const notifications = data?.notifications || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return <div className="text-white text-center py-10">Betöltés...</div>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden md:p-6 bg-transparent flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 py-2">
          <h1 className="text-2xl font-bold text-white px-2 sm:px-0">Értesítések</h1>

          <div className="flex gap-2 w-full sm:w-auto px-2 sm:px-0">
            <Button
              onClick={() => {
                if (window.confirm("Biztosan megjelölöd az összeset olvasottként?")) {
                  markAllAsRead.mutate();
                }
              }}
              disabled={markAllAsRead.isPending || notifications.length === 0}
              className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 py-2 px-4 shadow-none flex-1 sm:flex-none text-xs sm:text-sm"
              text="Összes olvasott"
              icon={<FaCheckDouble size={14} />}
            />
            <Button
              onClick={() => {
                if (
                  window.confirm("Biztosan törlöd az összes értesítést? Ez nem vonható vissza!")
                ) {
                  deleteAllNotifications.mutate();
                }
              }}
              disabled={deleteAllNotifications.isPending || notifications.length === 0}
              className="bg-red-600/30 hover:bg-red-600/50 text-red-400 py-2 px-4 shadow-none flex-1 sm:flex-none text-xs sm:text-sm"
              text="Összes törlése"
              icon={<FaTrash size={14} />}
            />
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-gray-800/30 mx-2 sm:mx-0 border border-gray-700/50 rounded-xl p-10 text-center text-gray-400 backdrop-blur-sm">
            Nincs egyetlen értesítésed sem.
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-2 sm:px-0 pb-10">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border backdrop-blur-sm transition-colors
                  ${!notif.read ? "bg-gray-800/80 border-gray-600 border-l-4 border-l-blue-500" : "bg-gray-800/30 border-gray-700/50"}
                `}
              >
                <div className="flex-1 pr-4 mb-3 sm:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm ${!notif.read ? "font-bold text-white" : "font-medium text-gray-300"}`}
                    >
                      {notif.type === "system" ? "Rendszerüzenet" : "Értesítés"}
                    </span>
                    <span className="text-xs text-gray-500">
                      •{" "}
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: hu,
                      })}
                    </span>
                  </div>
                  <p className={`text-sm ${!notif.read ? "text-gray-200" : "text-gray-400"}`}>
                    {notif.text}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead.mutate(notif._id)}
                      disabled={markAsRead.isPending}
                      className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded-full transition-colors focus:outline-none"
                      title="Olvasottnak jelöl"
                    >
                      <FaCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm("Biztosan törlöd ezt az értesítést?")) {
                        deleteNotification.mutate(notif._id);
                      }
                    }}
                    disabled={deleteNotification.isPending}
                    className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-full transition-colors focus:outline-none"
                    title="Törlés"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4 mb-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition font-bold"
            >
              Előző
            </button>
            <span className="text-gray-400 font-bold">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition font-bold"
            >
              Következő
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
