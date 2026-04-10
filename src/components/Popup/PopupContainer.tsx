import { useEffect, useRef } from "react";
import { useAppSelector } from "@/state/hooks";
import { usePopup } from "@/hooks/usePopup";
import { PopupItem } from "./PopupItem";

const PopupContainer = () => {
  const popups = useAppSelector((state) => state.popups.popups);
  const { hidePopup } = usePopup();
  const timeoutRefs = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const timeouts = timeoutRefs.current;

    popups.forEach((popup) => {
      if (popup.autoClose && popup.duration && !timeouts.has(popup.id)) {
        const timeout = window.setTimeout(() => {
          hidePopup(popup.id);
          timeouts.delete(popup.id);
        }, popup.duration);

        timeouts.set(popup.id, timeout);
      }
    });

    // Cleanup timeouts for removed popups
    const currentIds = new Set(popups.map((n) => n.id));
    timeouts.forEach((timeout, id) => {
      if (!currentIds.has(id)) {
        clearTimeout(timeout);
        timeouts.delete(id);
      }
    });

    // Cleanup on unmount
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, [popups, hidePopup]);

  if (popups.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 space-y-3 pointer-events-none">
      {popups.map((popup, index) => (
        <PopupItem
          key={popup.id}
          popup={popup}
          onClose={hidePopup}
          index={index}
        />
      ))}
    </div>
  );
};

export default PopupContainer;
