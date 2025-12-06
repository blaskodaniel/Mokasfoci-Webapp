import { CouponStatus, MatchStatus } from "./enums";

export const getCouponStatusInfo = (
  status: CouponStatus
): { color: string; text: string } => {
  switch (status) {
    case CouponStatus.active:
      return { color: "bg-green-600", text: "Aktív" };
    case CouponStatus.inactive:
      return { color: "bg-gray-600", text: "Inaktív" };
    case CouponStatus.inprogress:
      return { color: "bg-red-600", text: "Folyamatban" };
    default:
      return { color: "bg-yellow-600", text: "Ismeretlen" };
  }
};

export const getMatchStatusInfo = (
  status: MatchStatus | null
): { color: string; text: string } => {
  switch (status) {
    case MatchStatus.enabled:
      return { color: "bg-green-600", text: "Aktív" };
    case MatchStatus.disabled:
      return { color: "bg-gray-600", text: "Inaktív" };
    case MatchStatus.playing:
      return { color: "bg-red-600", text: "Folyamatban" };
    default:
      return { color: "bg-yellow-600", text: "Ismeretlen" };
  }
};

export const potentialWinnings = (bet: number, odds: number): number => {
  return parseFloat((bet * odds).toFixed(2));
};
