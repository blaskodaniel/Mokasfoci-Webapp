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

  if (oddsChanged) {
    return (
      <span className="flex flex-col items-center gap-0.5 leading-none text-white font-semibold">
        <span className="flex items-center gap-1">
          {currentOdds!.toFixed(2)}
          {oddsWentUp ? (
            <IoArrowUp className="text-green-400 text-[10px]" />
          ) : (
            <IoArrowDown className="text-red-400 text-[10px]" />
          )}
        </span>
        <span className="text-[10px] font-normal text-gray-500">({betOdds!.toFixed(2)})</span>
      </span>
    );
  }

  return (
    <span className={`${isThisBet ? "text-white font-semibold" : "text-gray-400"}`}>
      {currentOdds?.toFixed(2) ?? "-"}
    </span>
  );
};

export default OddsCell;
