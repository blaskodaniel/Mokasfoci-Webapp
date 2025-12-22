import type { MatchOutcome, MatchStatus, MatchType } from "@/utils/enums";
import type { Team } from "./team.type";
import type { Bet } from "./bet.type";
import type { User } from "./user.type";

export interface Match {
  _id: string;
  teamA?: Team;
  teamB?: Team;
  goalA?: number | null;
  goalB?: number | null;
  oddsAwin?: number | null;
  oddsDraw?: number | null;
  oddsBwin?: number | null;
  date?: Date | null;
  type: MatchType;
  timer?: boolean;
  location?: string | null;
  status: MatchStatus | null;
  comment?: string | null;
  outcome?: MatchOutcome;
  externalID?: string | null;
  isCalculated: boolean;
  [key: string]: unknown;
}

export interface MatchDetail {
  match: Match;
  coupons: Bet[];
  users: User[];
  totalBets: number;
  totalUsers: number;
}
