import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/state/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Ezek a típusok segítenek a TypeScript-nek
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
