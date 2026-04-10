import { configureStore } from "@reduxjs/toolkit";
import popupReducer from "@/state/popupSlice";

export const store = configureStore({
  reducer: {
    popups: popupReducer,
  },
});

// Ezek a típusok segítenek a TypeScript-nek
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
