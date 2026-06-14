import { useMemo, type FC } from "react";
import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import { CouponType, MatchOutcome } from "@/utils/enums";
import { APP_CONFIG } from "@/config";

interface MatchBetStatsProps {
  bets: Bet[];
  match: Match;
  showPercentages?: boolean;
}

// Egy fogadásból kiszedi, hogy melyik kimenetelre szól (hazai / döntetlen / vendég).
// Az outcomeBet a beírt outcome alapján, a scoreBet a tippelt eredményből származtatva.
const getBetOutcome = (bet: Bet): MatchOutcome | null => {
  if (bet.type === CouponType.outcomeBet && bet.outcome) {
    return bet.outcome;
  }
  if (bet.type === CouponType.scoreBet && bet.scoreTeamA != null && bet.scoreTeamB != null) {
    if (bet.scoreTeamA > bet.scoreTeamB) return MatchOutcome.home;
    if (bet.scoreTeamA < bet.scoreTeamB) return MatchOutcome.away;
    return MatchOutcome.draw;
  }
  return null;
};

const MatchBetStats: FC<MatchBetStatsProps> = ({ bets, match, showPercentages = true }) => {
  const stats = useMemo(() => {
    let home = 0;
    let draw = 0;
    let away = 0;

    for (const bet of bets) {
      const outcome = getBetOutcome(bet);
      if (outcome === MatchOutcome.home) home++;
      else if (outcome === MatchOutcome.draw) draw++;
      else if (outcome === MatchOutcome.away) away++;
    }

    return { home, draw, away, total: home + draw + away };
  }, [bets]);

  if (stats.total === 0) return null;

  const pct = (n: number) => Math.round((n / stats.total) * 100);

  const segments = [
    {
      key: "home",
      label: match.teamA?.tla || "Hazai",
      flag: match.teamA?.flag,
      count: stats.home,
      pct: pct(stats.home),
      barColor: "bg-emerald-500",
      textColor: "text-emerald-400",
    },
    {
      key: "draw",
      label: "Döntetlen",
      flag: null,
      count: stats.draw,
      pct: pct(stats.draw),
      barColor: "bg-gray-500",
      textColor: "text-gray-300",
    },
    {
      key: "away",
      label: match.teamB?.tla || "Vendég",
      flag: match.teamB?.flag,
      count: stats.away,
      pct: pct(stats.away),
      barColor: "bg-sky-500",
      textColor: "text-sky-400",
    },
  ];

  return (
    <div className="rounded-xl bg-gray-700/10 border border-white/5 p-4 mb-4 mx-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Fogadások megoszlása</h3>
        <span className="text-xs text-gray-400">{stats.total} tipp</span>
      </div>

      {/* Megoszlás sáv */}
      <div className="flex w-full h-2.5 rounded-full overflow-hidden mb-3 bg-gray-800">
        {segments.map(
          (s) =>
            s.count > 0 && (
              <div
                key={s.key}
                className={`${s.barColor} h-full`}
                style={{ width: `${s.pct}%` }}
                title={`${s.label}: ${s.count} (${s.pct}%)`}
              />
            )
        )}
      </div>

      {/* Jelmagyarázat */}
      <div className="grid grid-cols-3 gap-2">
        {segments.map((s) => (
          <div key={s.key} className="flex flex-col items-center text-center gap-1">
            <div className="flex items-center justify-center gap-1.5 min-w-0 max-w-full">
              {s.flag && (
                <img
                  src={`${APP_CONFIG.FLAG_PATH}${s.flag}`}
                  alt={s.label}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              )}
              <span className="text-xs text-gray-300 truncate">{s.label}</span>
            </div>
            {showPercentages && (
              <span className={`text-base font-bold ${s.textColor}`}>{s.pct}%</span>
            )}
            <span className="text-[10px] text-gray-500">{s.count} tipp</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchBetStats;
