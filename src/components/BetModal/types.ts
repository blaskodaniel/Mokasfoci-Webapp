import type { Bet } from "@/models/bet.type";
import type { MatchWithUserBet } from "@/components/Matches/types";
import type { CouponType, MatchOutcome } from "@/utils/enums";

export interface BetModalProps {
  isOpen: boolean;
  match: MatchWithUserBet;
  bets: Bet[];
  selectedTab?: CouponType;
  disableTabs?: CouponType[];
  hideTabbar?: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  onAfterSave?: (bet: number, outcome: MatchOutcome, editMode: boolean) => void;
}
