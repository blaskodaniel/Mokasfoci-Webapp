export interface Config {
  invitationCode: string;
  championStartDate: string | null;
  championEndDate: string;
  championWinPoint: number;
  defaultScore: number;
  favoritTeamFactor: number;
  groupWinPoint: number;
  notBetPoint: number;
  maxBet: number;
  minBet: number;
  enabledRegistration: boolean;
  enabledInvitation: boolean;
  scoreExactMatchOdds: number;
  scoreGoalDifferenceOdds: number;
  scoreOutcomeOdds: number;
}
