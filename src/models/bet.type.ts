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
  outcome: MatchOutcome;
  date: string;
  type: CouponType;
  isFavoriteTeam: boolean;
  [key: string]: unknown;
}
