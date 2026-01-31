import { useRef, useState, useLayoutEffect } from "react";
import { FiInfo } from "react-icons/fi";
import { useClickOutside } from "@/hooks/useClickOutside";

interface InfoTooltipProps {
  text: string;
  className?: string;
  children?: React.ReactNode;
}

const InfoTooltip = ({ text, className = "", children }: InfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    x: "left" | "right" | "center";
    y: "top" | "bottom";
  }>({ x: "center", y: "top" });

  useClickOutside(ref, () => setIsOpen(false));

  useLayoutEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      let x: "left" | "right" | "center" = "center";
      let y: "top" | "bottom" = "top";

      // Horizontal positioning
      if (rect.left < 100) {
        x = "left";
      } else if (screenWidth - rect.right < 100) {
        x = "right";
      }

      // Vertical positioning
      if (rect.top < 120) {
        y = "bottom";
      }

      setPos({ x, y });
    }
  }, [isOpen]);

  const getTooltipClasses = () => {
    const base =
      "absolute w-48 p-2 bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl z-50 pointer-events-none";

    let xClass = "left-1/2 -translate-x-1/2";
    if (pos.x === "left") xClass = "left-0 translate-x-0";
    if (pos.x === "right") xClass = "right-0 translate-x-0";

    let yClass = "bottom-full mb-2";
    if (pos.y === "bottom") yClass = "top-full mt-2";

    return `${base} ${xClass} ${yClass}`;
  };

  const getArrowClasses = () => {
    const base = "absolute border-4 border-transparent";

    let xClass = "left-1/2 -translate-x-1/2";
    if (pos.x === "left") xClass = "left-4";
    if (pos.x === "right") xClass = "right-4";

    let yClass = "top-full border-t-gray-600";
    if (pos.y === "bottom") yClass = "bottom-full border-b-gray-600";

    return `${base} ${xClass} ${yClass}`;
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={`${className} ${children ? "relative" : ""} inline-block`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
    >
      {children ? (
        children
      ) : (
        <FiInfo
          className="text-gray-500 hover:text-white cursor-pointer transition-colors"
          size={18}
        />
      )}

      {isOpen && (
        <div className={getTooltipClasses()}>
          <p className="text-xs text-gray-200 leading-relaxed text-center">{text}</p>
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
