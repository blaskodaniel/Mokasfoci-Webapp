import type { User } from "../models/user.type";
import { axiosInstance } from "./axiosConfig";
import type { SignInResponse } from "./types";

const Api = {
  async login(username: string, password: string): Promise<SignInResponse> {
    const response = await axiosInstance.post(
      `/auth/login`,
      {
        username,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  },

  async register(
    username: string,
    email: string,
    password: string,
    invitationCode?: string
  ): Promise<{ user: User }> {
    const response = await axiosInstance.post(`/auth/register`, {
      username,
      email,
      password,
      invitationCode,
    });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await axiosInstance.get(`/auth/me`);
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post(`/logout`, {});
  },

  async refreshToken(): Promise<{ accessToken: string; user: User } | null> {
    try {
      const response = await axiosInstance.post(`/auth/refresh-token`);
      return response.data;
    } catch (error) {
      console.error("Token frissítési hiba", error);
      return null;
    }
  },
};

export default Api;
