import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ReactNode } from "react";

export type PopupType = "success" | "error" | "warning" | "info";

export interface PopupItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  type: PopupType;
  duration?: number; // milliseconds
  icon?: ReactNode;
  autoClose?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
}

interface PopupState {
  popups: PopupItem[];
}

const initialState: PopupState = {
  popups: [],
};

const popupSlice = createSlice({
  name: "popups",
  initialState,
  reducers: {
    addPopup: (
      state,
      action: PayloadAction<Omit<PopupItem, "id">>
    ) => {
      const popup: PopupItem = {
        id: `popup_${Date.now()}_${Math.random()}`,
        duration: 3000,
        autoClose: true,
        ...action.payload,
      };
      state.popups.push(popup);
    },

    removePopup: (state, action: PayloadAction<string>) => {
      state.popups = state.popups.filter(
        (popup) => popup.id !== action.payload
      );
    },

    clearAllPopups: (state) => {
      state.popups = [];
    },

    updatePopup: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<PopupItem> }>
    ) => {
      const index = state.popups.findIndex(
        (n) => n.id === action.payload.id
      );
      if (index !== -1) {
        state.popups[index] = {
          ...state.popups[index],
          ...action.payload.updates,
        };
      }
    },
  },
});

export const {
  addPopup,
  removePopup,
  clearAllPopups,
  updatePopup,
} = popupSlice.actions;

export default popupSlice.reducer;
