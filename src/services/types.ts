import type { User } from "../models/user.type";

export interface SignInResponse {
  token: string;
  user: User;
}

export interface SignUpResponse {
  username: string;
  email: string;
  password: string;
  invitationCode?: string;
}

export interface UpdateUserProfileBody {
  name?: string;
  teamid?: string;
  winteamid?: string;
  A?: string;
  B?: string;
  C?: string;
  D?: string;
  E?: string;
  F?: string;
  G?: string;
  H?: string;
  I?: string;
  J?: string;
  K?: string;
  L?: string;
}

export interface DefaultAvatar {
  filename: string;
  name: string;
  path: string;
}

export interface BalanceHistoryEntry {
  date: string;
  balance: number;
}

export interface DailyBalanceChange {
  _id: string;
  balance: number;
  negativeBalance: number;
  positiveBalance: number;
}

export interface WinLostStats {
  won: number;
  lost: number;
  winRatePercentage: number;
}

export interface ScoreByMatch {
  matchId: string;
  matchDate: string;
  teamA: string;
  teamB: string;
  availableScore: number;
  profitScore: number;
  change: number;
}

export interface SimpleTeam {
  _id: string;
  name: string;
  flag: string | null;
}

export interface UserDetails {
  details: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    name?: string;
    data: {
      availableScore: number;
      profitScore: number;
      notbetcount: number;
      coupons: number;
      couponwin: number;
      couponlost: number;
      teamid?: SimpleTeam;
      A?: SimpleTeam;
      B?: SimpleTeam;
      C?: SimpleTeam;
      D?: SimpleTeam;
      E?: SimpleTeam;
      F?: SimpleTeam;
      G?: SimpleTeam;
      H?: SimpleTeam;
      I?: SimpleTeam;
      J?: SimpleTeam;
      K?: SimpleTeam;
      L?: SimpleTeam;
      winteamid?: SimpleTeam;
    };
  };
  stats: {
    averageBetAmount: number;
  };
}
