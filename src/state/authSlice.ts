import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "@/models/user.type";
import type { SignInResponse } from "@/services/types";
import Api from "@/services/service";
import { tokenUtils } from "@/utils/tokenUtils";

interface AuthState {
  isLoading: boolean;
  isInitialized: boolean;
  currentUser?: User;
  error?: string;
}

const initialState: AuthState = {
  isLoading: false,
  isInitialized: false,
  currentUser: undefined,
  error: undefined,
};

export const loginAction = createAsyncThunk<
  SignInResponse,
  { username: string; password: string }
>("auth/login", async (credentials) => {
  const response = await Api.login(credentials.username, credentials.password);
  return response;
});

export const getMeAction = createAsyncThunk<User, void>("auth/me", async () => {
  const response = await Api.getProfile();
  return response;
});

export const logoutAction = createAsyncThunk("auth/logout", async () => {
  const response = await Api.logout();
  return response;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = undefined;
    },
    clearAuth: (state) => {
      state.currentUser = undefined;
      state.isInitialized = true;
      tokenUtils.clearAuthData();
    },
    initializeFromStorage: (state) => {
      // Check if we have a token marker in localStorage
      // If yes, we should try to validate it with the server
      state.isInitialized = tokenUtils.hasTokenMarker();
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* loginAction */
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.currentUser = action.payload.user;
      state.isLoading = false;
      state.error = undefined;
      tokenUtils.markTokenExists();
    });
    builder.addCase(loginAction.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.currentUser = undefined;
      state.isLoading = false;
      state.error = action.error.message || "Login failed";
    });

    /* getMeAction */
    builder.addCase(getMeAction.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      // state.isInitialized = true;
      state.isLoading = false;
      state.error = undefined;
    });
    builder.addCase(getMeAction.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(getMeAction.rejected, (state, action) => {
      state.currentUser = undefined;
      // state.isInitialized = true;
      state.isLoading = false;
      state.error = action.error.message;
      // tokenUtils.removeTokenMarker();
    });

    /* logoutAction */
    builder.addCase(logoutAction.fulfilled, (state) => {
      state.currentUser = undefined;
      state.isLoading = false;
      state.error = undefined;
      tokenUtils.clearAuthData();
    });
    builder.addCase(logoutAction.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Logout failed";
    });
  },
});

export const { resetError, clearAuth, initializeFromStorage, setCurrentUser } =
  authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  !!state.auth.currentUser;
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.currentUser;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectIsInitialized = (state: { auth: AuthState }) =>
  state.auth.isInitialized;

export default authSlice.reducer;
