import type { User } from "../models/user.type";
import axiosInstance from "./axiosConfig";
import type { SignInResponse } from "./types";

const Api = {
  async login(username: string, password: string): Promise<SignInResponse> {
    const response = await axiosInstance.post(
      `/signin`,
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
    const response = await axiosInstance.post(`/signup`, {
      username,
      email,
      password,
      invitationCode,
    });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await axiosInstance.get(`/profile`);
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post(`/logout`, {});
  },
};

export default Api;
