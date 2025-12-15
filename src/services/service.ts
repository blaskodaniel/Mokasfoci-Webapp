import type { Match } from "@/models/match.type";
import type { User } from "../models/user.type";
import { axiosInstance } from "./axiosConfig";
import type { SignInResponse } from "./types";
import type { MatchOutcome } from "@/utils/enums";
import type { Bet } from "@/models/bet.type";

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
    await axiosInstance.post(`/auth/logout`, {});
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
    const response = await axiosInstance.get(`/match/upcoming`, {
      params: validParams,
    });
    return response.data;
  },

  async getRecentMatches(params: { limit?: number }): Promise<Match[]> {
    const validParams = new URLSearchParams({
      ...(params.limit ? { limit: params.limit.toString() } : {}),
    });
    const response = await axiosInstance.get(`/match/recent`, {
      params: validParams,
    });
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

  async createBet(
    matchId: string,
    amount: number,
    predictedWinner: MatchOutcome
  ): Promise<{ success: boolean }> {
    const response = await axiosInstance.post(`/user/bets`, {
      matchId,
      amount,
      outcome: predictedWinner,
    });
    return response.data;
  },

  async getUserBets(): Promise<Bet[]> {
    const response = await axiosInstance.get(`/user/mybets`);
    return response.data;
  },

  async deleteBet(betId: string): Promise<{ success: boolean }> {
    const response = await axiosInstance.delete(`/user/bets/${betId}`);
    return response.data;
  },

  async updateBet(betId: string, data: Partial<Bet>): Promise<Bet> {
    const response = await axiosInstance.patch(`/user/bets/${betId}`, data);
    return response.data;
  },

  async getAllMatches(): Promise<Match[]> {
    const response = await axiosInstance.get(`/match/all`);
    return response.data;
  },

  async getToplist(): Promise<User[]> {
    const response = await axiosInstance.get(`/user/toplist`);
    return response.data;
  },
};

export default Api;
