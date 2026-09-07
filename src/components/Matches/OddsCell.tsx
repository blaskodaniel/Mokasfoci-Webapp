import { MatchOutcome } from "@/utils/enums";
import type { MatchWithUserBet } from "./types";
import useGame from "@/hooks/useGame";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

interface OddsCellProps {
  match: MatchWithUserBet;
  outcome: MatchOutcome;
}

const OddsCell = ({ match, outcome }: OddsCellProps) => {
  const { userBetInfo } = useGame();
  const { outcomeBet } = userBetInfo(match.userbet || []);

  // Aktuális mérkőzés odds
  const currentOdds =
    outcome === MatchOutcome.home
      ? match.oddsAwin
      : outcome === MatchOutcome.draw
        ? match.oddsDraw
        : match.oddsBwin;

  // Csak ott mutatjuk az odds változást amelyik kimenetre tippelt a játékos
  const isThisBet = outcomeBet?.outcome === outcome;

  // Játékos odds, ami a fogdásán van
  const betOdds = outcomeBet?.odds;

  // Változott az odds a fogadásához képest?
  const oddsChanged =
    isThisBet && currentOdds != null && betOdds != null && betOdds !== currentOdds;
  const oddsWentUp = oddsChanged && currentOdds! > betOdds!;

  const chipClass = `inline-flex min-w-[3.25rem] items-center justify-center rounded-md px-2 py-1
    text-sm font-black tabular-nums transition-colors ${
      isThisBet
        ? "border border-badge-amber/40 bg-badge-amber/15 text-badge-amber shadow-[0_0_10px_-2px_rgba(245,165,36,0.6)]"
        : "border border-white/10 bg-white/5 text-white"
    }`;

  if (currentOdds == null) {
    return <span className="text-text-muted">-</span>;
  }

  if (oddsChanged) {
    return (
      <span className="inline-flex flex-col items-center gap-0.5 leading-none">
        <span className={`${chipClass} flex items-center gap-1`}>
          {currentOdds!.toFixed(2)}
          {oddsWentUp ? (
            <IoArrowUp className="text-badge-success text-[10px]" />
          ) : (
            <IoArrowDown className="text-badge-live text-[10px]" />
          )}
        </span>
        <span className="text-[10px] font-normal text-text-muted">({betOdds!.toFixed(2)})</span>
      </span>
    );
  }

  return <span className={chipClass}>{currentOdds.toFixed(2)}</span>;
};

export default OddsCell;
