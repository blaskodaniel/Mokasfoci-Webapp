import { useCallback, type ReactNode } from "react";
import { useAppDispatch } from "@/state/hooks";
import {
  addPopup,
  removePopup,
  clearAllPopups,
  type PopupItem,
  type PopupType,
} from "@/state/popupSlice";

export interface ShowPopupOptions {
  title: string;
  subtitle?: string;
  description?: string;
  type?: PopupType;
  duration?: number;
  icon?: ReactNode;
  autoClose?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
}

export const usePopup = () => {
  const dispatch = useAppDispatch();

  const showPopup = useCallback(
    (options: ShowPopupOptions) => {
      const popupData: Omit<PopupItem, "id"> = {
        type: "info",
        duration: 3000,
        autoClose: true,
        ...options,
      };

      dispatch(addPopup(popupData));
    },
    [dispatch]
  );

  const hidePopup = useCallback(
    (id: string) => {
      dispatch(removePopup(id));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearAllPopups());
  }, [dispatch]);

  // Convenience methods for different types
  const showSuccess = useCallback(
    (title: string, options?: Omit<ShowPopupOptions, "title" | "type">) => {
      showPopup({ title, type: "success", ...options });
    },
    [showPopup]
  );

  const showError = useCallback(
    (title: string, options?: Omit<ShowPopupOptions, "title" | "type">) => {
      showPopup({ title, type: "error", duration: 5000, ...options });
    },
    [showPopup]
  );

  const showWarning = useCallback(
    (title: string, options?: Omit<ShowPopupOptions, "title" | "type">) => {
      showPopup({ title, type: "warning", duration: 4000, ...options });
    },
    [showPopup]
  );

  const showInfo = useCallback(
    (title: string, options?: Omit<ShowPopupOptions, "title" | "type">) => {
      showPopup({ title, type: "info", ...options });
    },
    [showPopup]
  );

  return {
    showPopup,
    hidePopup,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
