import { useState, useEffect, type ReactNode } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCloseOutline,
} from "react-icons/io5";
import type { PopupItem as PopupItemType } from "@/state/popupSlice";

interface PopupItemProps {
  popup: PopupItemType;
  onClose: (id: string) => void;
  index: number;
}

const defaultIcons: Record<PopupItemType["type"], ReactNode> = {
  success: <IoCheckmarkCircleOutline size={22} />,
  error: <IoCloseCircleOutline size={22} />,
  warning: <IoWarningOutline size={22} />,
  info: <IoInformationCircleOutline size={22} />,
};

const typeStyles = {
  success: {
    accent: "bg-badge-success",
    icon: "border-badge-success-border bg-badge-success-bg text-badge-success",
    badge: "border-badge-success-border bg-badge-success-bg text-badge-success",
    label: "SIKERES",
  },
  error: {
    accent: "bg-badge-live",
    icon: "border-badge-live-border bg-badge-live-bg text-badge-live",
    badge: "border-badge-live-border bg-badge-live-bg text-badge-live",
    label: "HIBA",
  },
  warning: {
    accent: "bg-badge-amber",
    icon: "border-badge-amber-border bg-badge-amber-bg text-badge-amber",
    badge: "border-badge-amber-border bg-badge-amber-bg text-badge-amber",
    label: "FIGYELMEZTETÉS",
  },
  info: {
    accent: "bg-accent-soft",
    icon: "border-accent/40 bg-accent/15 text-accent-soft",
    badge: "border-accent/40 bg-accent/15 text-accent-soft",
    label: "INFORMÁCIÓ",
  },
};

export const PopupItem = ({ popup, onClose, index }: PopupItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const styles = typeStyles[popup.type];
  const icon = popup.icon || defaultIcons[popup.type];

  useEffect(() => {
    // Delay for staggered animation
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => onClose(popup.id), 300);
  };

  const baseClasses = `
    relative w-full overflow-hidden rounded-tile border border-tile-border
    bg-[image:var(--tile-bg-gradient)] shadow-tile pointer-events-auto
    transition-[transform,opacity] duration-300 ease-out
  `;

  const animationClasses = isRemoving
    ? "translate-x-6 opacity-0"
    : isVisible
      ? "translate-x-0 opacity-100"
      : "translate-x-6 opacity-0";

  return (
    <div
      className={`${baseClasses} ${animationClasses}`}
      role={popup.type === "error" ? "alert" : "status"}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${styles.accent}`} />

      {popup.autoClose && popup.duration && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5">
          <div
            className={`h-full origin-left ${styles.accent} animate-progress`}
            style={{
              animation: `progress ${popup.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <div className="p-4 pl-5">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border ${styles.icon}`}>
            {icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-[0.12em] ${styles.badge}`}>
                {styles.label}
              </span>
            </div>
            <div className="text-sm font-bold leading-5 text-text-primary">{popup.title}</div>

            {popup.subtitle && (
              <div className="mt-1 text-xs text-text-secondary">{popup.subtitle}</div>
            )}

            {popup.description && (
              <div className="mt-2 text-xs leading-5 text-text-secondary">{popup.description}</div>
            )}

            {popup.actions && popup.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {popup.actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    type="button"
                    onClick={action.onClick}
                    className={`
                      rounded-md px-3 py-1.5 text-xs font-bold transition-colors
                      ${
                        action.variant === "primary"
                          ? "bg-[image:var(--gradient-cta)] text-white hover:bg-[image:var(--gradient-cta-hover)]"
                          : "border border-tile-border bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Értesítés bezárása"
            className="shrink-0 rounded-full p-1 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
          >
            <IoCloseOutline size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
