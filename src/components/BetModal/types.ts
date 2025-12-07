import type { Match } from "@/models/match.type";
import type { MatchOutcome } from "@/utils/enums";

export interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bet: number, outcome: MatchOutcome, editMode: boolean) => void;
  match: Match;
  loading?: boolean;
  initBetValue?: number;
  initSelectedOutcome?: MatchOutcome;
  editMode?: boolean;
}
