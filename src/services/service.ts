import type { Match } from "@/models/match.type";
import type { User } from "../models/user.type";
import { axiosInstance } from "./axiosConfig";
import type {
  BadgesResponse,
  BalanceHistoryEntry,
  DefaultAvatar,
  GetTeamRankingsResponse,
  GroupDetailsResponse,
  MatchDetail,
  ScoreByMatchResponse,
  SignInResponse,
  TeamDetails,
  TournamentBracketResponse,
  UpdateUserProfileBody,
  UserDetails,
  WinLostStats,
} from "./types";
import type { MatchOutcome, CouponType } from "@/utils/enums";
import type { Bet } from "@/models/bet.type";
import type { Transaction } from "@/models/transaction.type";
import type { Team } from "@/models/team.type";
import type { Config } from "@/models/config.type";
import type { ChatMessage } from "@/models/chat.type";
import type { AppNotification } from "@/models/notification.type";

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

  async getLiveMatches(): Promise<Match[]> {
    const response = await axiosInstance.get("/match/live");
    return response.data;
  },

  async getTeamMatches(teamId: string): Promise<Match[]> {
    const response = await axiosInstance.get(`/matches/team/${teamId}`);
    return response.data;
  },

  // Players endpoints
  async getTopScorers(limit = 10): Promise<User[]> {
    const response = await axiosInstance.get(`/players/top-scorers?limit=${limit}`);
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

  async createBet(data: {
    matchId: string;
    amount: number;
    type: CouponType;
    outcome?: MatchOutcome;
    scoreTeamA?: number;
    scoreTeamB?: number;
    teamId?: string;
  }): Promise<{ success: boolean }> {
    const response = await axiosInstance.post(`/user/bets`, data);
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

  async getAllMatches({
    sortBy,
    sortOrder,
    startDate,
    endDate,
  }: {
    sortBy?: string;
    sortOrder?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Match[]> {
    const response = await axiosInstance.get(`/match/all`, {
      params: {
        sortBy,
        sortOrder,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      },
    });
    return response.data;
  },

  async getToplist(): Promise<User[]> {
    const response = await axiosInstance.get(`/user/toplist`);
    return response.data;
  },

  async getMatchDetails(matchId: string): Promise<MatchDetail> {
    const response = await axiosInstance.get(`/match/details/${matchId}`);
    return response.data;
  },

  async getNotifications(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    notifications: AppNotification[];
    total: number;
    unreadCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  async markNotificationAsRead(id: string): Promise<AppNotification> {
    const response = await axiosInstance.patch(`/notifications/${id}`);
    return response.data;
  },

  async markAllNotificationsAsRead(): Promise<void> {
    const response = await axiosInstance.patch(`/notifications/read-all`);
    return response.data;
  },

  async deleteNotification(id: string): Promise<void> {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },

  async deleteAllNotifications(): Promise<void> {
    const response = await axiosInstance.delete(`/notifications/delete-all`);
    return response.data;
  },

  async getUserTransactions(): Promise<Transaction[]> {
    const response = await axiosInstance.get(`/user/mytransactions`);
    return response.data;
  },

  async getTeams(): Promise<Team[]> {
    const response = await axiosInstance.get(`/team/all`);
    return response.data;
  },

  async getTeamDetails(teamId: string): Promise<TeamDetails> {
    const response = await axiosInstance.get(`/team/details/${teamId}`);
    return response.data;
  },

  async updateProfile(data: UpdateUserProfileBody): Promise<{ success: boolean }> {
    const response = await axiosInstance.patch(`/user/profile`, data);
    return response.data;
  },

  async updateAvatar(avatarFilename: string): Promise<{ avatar: string; message: string }> {
    const response = await axiosInstance.patch(`/user/avatar`, {
      avatarFilename,
    });
    return response.data;
  },

  async uploadAvatar(formData: FormData): Promise<{ avatar: string; message: string }> {
    const response = await axiosInstance.post(`/user/avatar/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getDefaultAvatars(): Promise<DefaultAvatar[]> {
    const response = await axiosInstance.get(`/user/avatars/default`);
    return response.data;
  },

  async getBalanceHistory(params: {
    from?: string;
    to?: string;
    userId?: string;
  }): Promise<BalanceHistoryEntry[]> {
    const response = await axiosInstance.get(`/user/stats/balance-history`, {
      params: {
        from: params.from,
        to: params.to,
        userid: params.userId,
      },
    });
    return response.data;
  },

  async getWinLostStats(userId?: string): Promise<WinLostStats> {
    const response = await axiosInstance.get(`/user/stats/win-loss`, {
      params: {
        userid: userId,
      },
    });
    return response.data;
  },

  async getScoreByMatches(userids?: string[]): Promise<ScoreByMatchResponse> {
    const response = await axiosInstance.post(`/user/stats/score-by-matches`, { userids });
    return response.data;
  },

  async getPlayerDetails(userId: string): Promise<UserDetails> {
    const response = await axiosInstance.get(`/user/${userId}`);
    return response.data;
  },

  async getConfigs(): Promise<Config> {
    const response = await axiosInstance.get(`/config/all`);
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post(`/auth/forgot-password`, { email });
    return response.data;
  },

  async resetPassword(password: string, token: string): Promise<{ message: string }> {
    const response = await axiosInstance.post(`/auth/reset-password`, {
      password,
      token,
    });
    return response.data;
  },

  async getGroupsStandings(): Promise<GetTeamRankingsResponse> {
    const response = await axiosInstance.get(`/group/standings`);
    return response.data;
  },

  async getGroupStandingsById(groupId: string): Promise<Team[]> {
    const response = await axiosInstance.get(`/group/${groupId}/standings`);
    return response.data;
  },

  async getMyBadges(): Promise<BadgesResponse> {
    const response = await axiosInstance.get(`/user/mybadges`);
    return response.data;
  },

  async getBadgesByUser(userId: string): Promise<BadgesResponse> {
    const response = await axiosInstance.get(`/user/${userId}/badges`);
    return response.data;
  },

  async getGroupById(groupId: string): Promise<GroupDetailsResponse> {
    const response = await axiosInstance.get(`/group/${groupId}/details`);
    return response.data;
  },

  async getTournamentBracket(): Promise<TournamentBracketResponse> {
    const response = await axiosInstance.get(`/match/bracket`);
    return response.data;
  },

  async getChatMessages(
    room: string,
    before?: string,
    limit?: number,
    skip?: number
  ): Promise<ChatMessage[]> {
    const response = await axiosInstance.get(`/chat/${room}/messages`, {
      params: {
        before,
        limit,
        skip,
      },
    });
    return response.data;
  },
};

export default Api;
