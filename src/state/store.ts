import { configureStore } from "@reduxjs/toolkit";
// Később ide importálod majd a "slice"-okat

export const store = configureStore({
  reducer: {
    // Pl.: counter: counterReducer,
  },
});

// Ezek a típusok segítenek a TypeScript-nek
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
