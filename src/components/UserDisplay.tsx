import type { User } from "@/models/user.type";
import { APP_CONFIG, DEFAULT_AVATAR_URL } from "@/config";

interface UserDisplayProps {
  user: User;
  showAvatar?: boolean;
  showUsername?: boolean;
  className?: string;
  avatarSize?: "xs" | "sm" | "md" | "lg";
  nameClassName?: string;
  onClick?: () => void;
}

const UserDisplay = ({
  user,
  showAvatar = true,
  showUsername = true,
  className = "",
  avatarSize = "md",
  nameClassName = "",
  onClick,
}: UserDisplayProps) => {
  const getAvatarUrl = () => {
    if (user?.avatar && user.avatar.trim() !== "") {
      return `${APP_CONFIG.SERVER_URL}${user.avatar}`;
    }
    return DEFAULT_AVATAR_URL;
  };

  const getSizeClasses = () => {
    switch (avatarSize) {
      case "xs":
        return "w-6 h-6 text-xs";
      case "sm":
        return "w-8 h-8 text-sm";
      case "md":
        return "w-10 h-10 text-base";
      case "lg":
        return "w-12 h-12 text-lg";
      default:
        return "w-10 h-10 text-base";
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showAvatar && (
        <div
          className={`rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold ${getSizeClasses()}`}
        >
          <img
            src={getAvatarUrl()}
            alt={`${user?.username} avatar`}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              // Ha a kép betöltése sikertelen, fallback karakter
              e.currentTarget.style.display = "none";
              const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallbackDiv) {
                fallbackDiv.style.display = "flex";
              }
            }}
          />
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{ display: "none" }}
          >
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      )}
      {showUsername && (
        <div
          className={`font-semibold truncate ${nameClassName} ${onClick ? "cursor-pointer" : ""}`}
          onClick={() => onClick && onClick()}
        >
          {user?.username || ""}
        </div>
      )}
    </div>
  );
};

export default UserDisplay;
