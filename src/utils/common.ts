import type { Bet } from "@/models/bet.type";
import { CouponStatus, MatchOutcome, MatchStatus } from "./enums";
import type { Match } from "@/models/match.type";

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

export const outcomeText = (bet: Bet, match: Match) =>
  bet.outcome === MatchOutcome.home
    ? match.teamA?.name
    : bet.outcome === MatchOutcome.away
    ? match.teamB?.name
    : "Döntetlen";

/**
 * Formázza a nagy számokat olvashatóbb formátumba
 * @param num - A formázandó szám
 * @param compact - Ha true, rövid formátum (1K, 1M), ha false, szóközzel elválasztott
 * @returns Formázott szám string
 */
export const formatNumber = (num: number, compact: boolean = false): string => {
  if (isNaN(num) || num === null || num === undefined) return "0";

  if (compact) {
    // Kompakt formátum: 1K, 1M, 1B
    const absNum = Math.abs(num);

    if (absNum >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (absNum >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (absNum >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }

    return num.toString();
  } else {
    // Szóközzel elválasztott formátum: 1 234 567
    return new Intl.NumberFormat("hu-HU").format(num);
  }
};

/**
 * Formázza a pontszámot szép megjelenítéshez
 * @param points - Pontszám
 * @param showUnit - Megjelenítse-e a "pont" szót
 * @param compact - Kompakt formátum használata
 */
export const formatPoints = (
  points: number,
  showUnit: boolean = true,
  compact: boolean = false
): string => {
  const formatted = formatNumber(points, compact);
  return showUnit ? `${formatted} pont` : formatted;
};
