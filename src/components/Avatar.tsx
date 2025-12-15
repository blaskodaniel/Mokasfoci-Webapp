import type { FC } from "react";

interface AvatarProps {
  avatar: string;
}

const Avatar: FC<AvatarProps> = ({ avatar }) => {
  return (
    <div>
      <img src={avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
    </div>
  );
};

export default Avatar;
