import { APP_CONFIG, DEFAULT_AVATAR_URL } from "@/config";
import { useMemo, type FC } from "react";

interface AvatarProps {
  avatar: string;
  size?: number;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ avatar, size = 10, className = "" }) => {
  const userAvatarUrl = useMemo(
    () => (avatar ? `${APP_CONFIG.SERVER_URL}${avatar}` : DEFAULT_AVATAR_URL),
    [avatar]
  );
  return (
    <div className={`shrink-0 ${className}`}>
      <img
        src={userAvatarUrl}
        alt="User Avatar"
        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
        className="rounded-full object-cover"
      />
    </div>
  );
};

export default Avatar;
