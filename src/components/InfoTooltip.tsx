import { useRef, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { useClickOutside } from "@/hooks/useClickOutside";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

const InfoTooltip = ({ text, className = "" }: InfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={`${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
    >
      <FiInfo
        className="text-gray-500 hover:text-white cursor-pointer transition-colors"
        size={15}
      />

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-40 p-2 bg-gray-900/95 
        backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl z-100"
        >
          <p className="text-xs text-gray-200 leading-relaxed">{text}</p>
          <div className="absolute bottom-full right-1 border-4 border-transparent border-b-gray-600" />
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
