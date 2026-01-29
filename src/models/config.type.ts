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
  enabledNegativeScore: boolean;
  enabledRegistration: boolean;
  enabledInvitation: boolean;
  enabledNotBetPointSubtractByLaterRegister: boolean;
  enabledNotBetPointSubtract: boolean;
}
