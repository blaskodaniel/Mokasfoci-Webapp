import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "@/models/user.type";
import type { SignInResponse } from "@/services/types";
import Api from "@/services/service";

interface AuthState {
  isLoading: boolean;
  isInit: boolean;
  isLoggedIn?: boolean;
  currentUser?: User;
}

const initialState: AuthState = {
  isLoading: false,
  isLoggedIn: false,
  isInit: false,
  currentUser: undefined,
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
  reducers: {},
  extraReducers: (builder) => {
    /* loginAction */
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.currentUser = action.payload.user;
      state.isLoggedIn = true;
      state.isLoading = false;
    });
    builder.addCase(loginAction.pending, (state) => {
      state.isLoading = true;
      state.currentUser = undefined;
    });
    builder.addCase(loginAction.rejected, (state) => {
      state.currentUser = undefined;
      state.isLoading = false;
      state.isLoggedIn = false;
    });

    /* getMeAction */
    builder.addCase(getMeAction.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      state.isInit = false;
    });
    builder.addCase(getMeAction.pending, (state) => {
      state.isInit = true;
      state.currentUser = undefined;
    });
    builder.addCase(getMeAction.rejected, (state) => {
      state.currentUser = undefined;
      state.isInit = false;
    });

    /* logoutAction */
    builder.addCase(logoutAction.fulfilled, (state) => {
      state.currentUser = undefined;
      state.isLoggedIn = false;
      state.isLoading = false;
    });
    builder.addCase(logoutAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutAction.rejected, (state) => {
      state.isLoading = false;
      state.currentUser = undefined;
      state.isLoggedIn = false;
    });
  },
});

// export const { setToken } = authSlice.actions;
export default authSlice.reducer;
