import type { Bet } from "@/models/bet.type";
import { CouponStatus, MatchOutcome, MatchStatus, MatchType, TransactionType } from "./enums";
import type { Match } from "@/models/match.type";

export const getCouponStatusInfo = (
  status: CouponStatus
): { color: string; text: string; className?: string } => {
  switch (status) {
    case CouponStatus.active:
      return { color: "bg-green-600", text: "Játékban", className: "" };
    case CouponStatus.inactive:
      return { color: "bg-gray-600", text: "Inaktív", className: "" };
    case CouponStatus.closed:
      return { color: "bg-gray-600", text: "Lezárva", className: "" };
    case CouponStatus.inprogress:
      return {
        color: "bg-red-600",
        text: "Játékban",
        className: "animate-pulse",
      };
    default:
      return { color: "bg-yellow-600", text: "Ismeretlen" };
  }
};

export const getMatchStatusInfo = (
  status: MatchStatus | null
): { color: string; text: string; className?: string } => {
  switch (status) {
    case MatchStatus.enabled:
      return { color: "", text: "", className: "" };
    case MatchStatus.finished:
      return { color: "bg-gray-600", text: "Vége", className: "" };
    case MatchStatus.playing:
      return {
        color: "bg-red-600",
        text: "LIVE",
        className: "animate-pulse text-white",
      };
    default:
      return { color: "bg-yellow-600", text: "Ismeretlen" };
  }
};

export const getMatchTypeText = (type: MatchType): string => {
  switch (type) {
    case MatchType.Final:
      return "Döntő";
    case MatchType.Semifinal:
      return "Elődöntő";
    case MatchType.Quarterfinal:
      return "Negyedöntő";
    case MatchType.RoundOf16:
      return "Nyolcaddöntő";
    case MatchType.GroupStageRound1:
      return "Csoportkör 1. forduló";
    case MatchType.GroupStageRound2:
      return "Csoportkör 2. forduló";
    case MatchType.GroupStageRound3:
      return "Csoportkör 3. forduló";
    default:
      return type;
  }
};

export const getTransactionTypeColors: Record<string, string> = {
  bet: "bg-blue-500 text-white",
  win: "bg-green-500 text-white",
  penalty: "bg-red-500 text-white",
  refund: "bg-yellow-500 text-black",
  initial: "bg-gray-500 text-white",
  correction: "bg-purple-500 text-white",
  betModification: "bg-pink-500 text-white",
  reward: "bg-orange-500 text-white",
};

export const getTransactionTypeText = (type: TransactionType) => {
  switch (type) {
    case TransactionType.bet:
      return "tét";
    case TransactionType.win:
      return "nyeremény";
    case TransactionType.correction:
      return "korrekció";
    case TransactionType.betModification:
      return "tét módosítás";
    case TransactionType.initial:
      return "kezdő összeg";
    case TransactionType.penalty:
      return "büntetés";
    case TransactionType.refund:
      return "visszatérítés";
    case TransactionType.reward:
      return "jutalom";
  }
};

export const potentialWinnings = (bet: number, odds: number, additional = 1): number => {
  return parseFloat((bet * odds * additional).toFixed(2));
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
