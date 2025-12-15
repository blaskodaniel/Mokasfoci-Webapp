import { useNotification } from "@/hooks/useNotification";
import { IoHeartOutline, IoRocketOutline } from "react-icons/io5";

const NotificationDemo = () => {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
    clearAll,
  } = useNotification();

  const handleCustomNotification = () => {
    showNotification({
      title: "Egyedi notification",
      subtitle: "Kustomizált ikon és műveletek",
      description:
        "Ez egy teljesen testreszabott notification üzenet hosszabb leírással.",
      type: "info",
      duration: 10000,
      icon: <IoRocketOutline size={24} className="text-purple-400" />,
      actions: [
        {
          label: "Elfogadás",
          onClick: () => console.log("Elfogadva"),
          variant: "primary" as const,
        },
        {
          label: "Mégse",
          onClick: () => console.log("Mégsem"),
          variant: "secondary" as const,
        },
      ],
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-white mb-6">Notification Demo</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() =>
            showSuccess("Siker!", {
              subtitle: "A művelet sikeresen végrehajtva",
            })
          }
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Success
        </button>

        <button
          onClick={() =>
            showError("Hiba történt!", {
              subtitle: "Valami rosszul ment",
              description: "Részletes hiba leírás itt...",
            })
          }
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Error
        </button>

        <button
          onClick={() =>
            showWarning("Figyelmeztetés", {
              subtitle: "Ez egy figyelmeztetés",
              description: "Kérjük vegye figyelembe ezt az információt.",
            })
          }
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          Warning
        </button>

        <button
          onClick={() =>
            showInfo("Információ", {
              subtitle: "Hasznos információ",
              description: "Ez egy informatív üzenet a felhasználó számára.",
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Info
        </button>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={handleCustomNotification}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Egyedi Notification (Ikonnal és Gombokkal)
        </button>

        <button
          onClick={() =>
            showNotification({
              title: "Fogadás sikeresen létrehozva!",
              subtitle: "Barcelona vs Real Madrid",
              description:
                "A fogadásod: Barcelona győzelem, 1000 pont tét. Várható nyeremény: 2400 pont",
              type: "success",
              duration: 8000,
              icon: <IoHeartOutline size={24} className="text-green-400" />,
            })
          }
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Fogadás Notification
        </button>

        <button
          onClick={() =>
            showNotification({
              title: "Hosszú üzenet",
              type: "warning",
              autoClose: false, // Nem záródik be automatikusan
            })
          }
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Tartós Notification (Nem záródik be)
        </button>

        <button
          onClick={clearAll}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Összes Törlése
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Használat:</h3>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          {`// Hook használata
const { showSuccess, showError, showWarning, showInfo } = useNotification();

// Egyszerű használat
showSuccess('Siker!');
showError('Hiba történt!');

// Részletes használat
showNotification({
  title: 'Címsor',
  subtitle: 'Alcím',
  description: 'Részletes leírás...',
  type: 'success',
  duration: 5000,
  icon: <CustomIcon />,
  actions: [
    { label: 'OK', onClick: () => {}, variant: 'primary' }
  ]
});`}
        </pre>
      </div>
    </div>
  );
};

export default NotificationDemo;
