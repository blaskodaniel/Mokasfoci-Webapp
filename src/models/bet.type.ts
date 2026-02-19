import type { CouponStatus, CouponType, MatchOutcome } from "@/utils/enums";
import type { Match } from "./match.type";
import type { User } from "./user.type";

export interface Bet {
  _id: string;
  userid: User;
  matchid: Match;
  amount: number;
  odds: number;
  totalWin: number;
  success: boolean;
  status: CouponStatus;
  outcome?: MatchOutcome;
  date: string;
  type: CouponType;
  isFavoriteTeam?: boolean;
  scoreTeamA?: number;
  scoreTeamB?: number;
  teamId?: string;
  [key: string]: unknown;
}

export interface IOutcomeCoupon extends Bet {
  type: CouponType.outcomeBet;
  outcome: MatchOutcome;
  isFavoriteTeam: boolean;
}

export interface IAdvancementCoupon extends Bet {
  type: CouponType.advancementBet;
  teamId: string;
}

export interface IScoreCoupon extends Bet {
  type: CouponType.scoreBet;
  scoreTeamA: number;
  scoreTeamB: number;
}

export type ICoupon = IOutcomeCoupon | IAdvancementCoupon | IScoreCoupon;
