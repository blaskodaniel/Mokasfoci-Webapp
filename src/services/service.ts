import type { Match } from "@/models/match.type";
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
    const response = await axiosInstance.post(`/auth/refresh-token`);
    return response.data;
  },

  // Matches endpoints
  async getUpcomingMatches(params: { limit?: number }): Promise<Match[]> {
    const validParams = new URLSearchParams({
      ...(params.limit ? { limit: params.limit.toString() } : {}),
    });
    const response = await axiosInstance.get(`/match/all`, {
      params: validParams,
    });
    return response.data;
  },

  async getRecentMatches(): Promise<Match[]> {
    const response = await axiosInstance.get(`/matches/recent`);
    return response.data;
  },

  async getTeamMatches(teamId: string): Promise<Match[]> {
    const response = await axiosInstance.get(`/matches/team/${teamId}`);
    return response.data;
  },

  // Players endpoints
  async getTopScorers(limit = 10): Promise<User[]> {
    const response = await axiosInstance.get(
      `/players/top-scorers?limit=${limit}`
    );
    return response.data;
  },

  async getPlayerStats(playerId: string): Promise<User> {
    const response = await axiosInstance.get(`/players/${playerId}/stats`);
    return response.data;
  },

  async getTeamPlayers(teamId: string): Promise<User[]> {
    const response = await axiosInstance.get(`/teams/${teamId}/players`);
    return response.data;
  },
};

export default Api;
