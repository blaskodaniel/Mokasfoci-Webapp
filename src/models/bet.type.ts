import type { CouponStatus, CouponType, MatchOutcome } from "@/utils/enums";
import type { Match } from "./match.type";
import type { User } from "./user.type";

export interface Bet {
  _id: string;
  userid: User;
  matchid: Match;
  bet: number;
  odds: number;
  totalWin: number;
  success: boolean;
  status: CouponStatus;
  outcome: MatchOutcome;
  date: string;
  type: CouponType;
  [key: string]: unknown;
}
