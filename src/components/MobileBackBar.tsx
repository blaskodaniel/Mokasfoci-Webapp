import useResponsive from "@/hooks/useResponsive";
import type { FC } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

interface MobileBackBarProps {
  title?: string;
}

const MobileBackBar: FC<MobileBackBarProps> = ({ title }) => {
  const { isDesktop } = useResponsive();

  if (isDesktop) return null;

  return (
    <div className="relative flex items-center justify-center mb-5 h-8">
      <MdOutlineKeyboardBackspace
        size={23}
        className="absolute left-2 cursor-pointer text-gray-400"
        onClick={() => window.history.back()}
      />
      {title && <div className="text-white font-thin text-md">{title}</div>}
    </div>
  );
};

export default MobileBackBar;
