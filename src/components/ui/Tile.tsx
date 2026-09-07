import { motion } from "framer-motion";
import type { ReactNode } from "react";

type TileAccent = "none" | "accent" | "pink" | "success" | "amber";

interface TileProps {
  children?: ReactNode;
  title?: string;
  titleIcon?: ReactNode;
  headerRight?: ReactNode;
  accent?: TileAccent;
  interactive?: boolean;
  loading?: boolean;
  error?: string;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  onClick?: () => void;
  delay?: number;
}

const accentBar: Record<TileAccent, string> = {
  none: "",
  accent: "before:bg-accent",
  pink: "before:bg-highlight",
  success: "before:bg-badge-success",
  amber: "before:bg-badge-amber",
};

const accentTitle: Record<TileAccent, string> = {
  none: "text-text-secondary",
  accent: "text-accent-soft",
  pink: "text-highlight",
  success: "text-badge-success",
  amber: "text-badge-amber",
};

const Tile = ({
  children,
  title,
  titleIcon,
  headerRight,
  accent = "none",
  interactive = false,
  loading,
  error,
  footer,
  className = "",
  bodyClassName = "",
  onClick,
  delay = 0,
}: TileProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={interactive ? { y: -3 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-tile border border-tile-border
        bg-[image:var(--tile-bg-gradient)] shadow-tile transition-[border-color,box-shadow]
        duration-300 ${interactive ? "cursor-pointer hover:border-tile-border-hover hover:shadow-tile-hover" : ""}
        ${accent !== "none" ? `before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] ${accentBar[accent]}` : ""}
        ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2.5">
          <div
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${accentTitle[accent]}`}
          >
            {titleIcon}
            {title}
          </div>
          {headerRight}
        </div>
      )}

      {error && <div className="px-4 py-3 text-sm text-red-400">{error}</div>}

      <div className={`relative ${loading ? "min-h-32" : ""} ${bodyClassName}`}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-sm text-text-secondary">
            Betöltés...
          </div>
        )}
        {children}
      </div>

      {footer && (
        <div className="border-t border-tile-border bg-black/15 px-4 py-2 text-xs">{footer}</div>
      )}
    </motion.div>
  );
};

export default Tile;
