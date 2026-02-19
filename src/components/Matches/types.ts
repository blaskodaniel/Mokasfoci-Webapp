import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import type { Column } from "../Table/types";

export type MatchWithUserBet = Match & {
  userbet?: Bet[];
};

export interface MatchesDesktopViewProps {
  matchesWithBets: MatchWithUserBet[];
  columns: Column<MatchWithUserBet>[];
  loading: boolean;
  error?: string;
}

export type MatchesMobileViewProps = {
  matchesWithBets: MatchWithUserBet[];
  loading: boolean;
  error?: string;
  onSelectMatch?: (match: MatchWithUserBet | null) => void;
};
