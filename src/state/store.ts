import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "@/state/notificationSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
  },
});

// Ezek a típusok segítenek a TypeScript-nek
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
