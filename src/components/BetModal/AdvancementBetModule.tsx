import { useConfig } from "@/hooks/useConfig";
import useGame from "@/hooks/useGame";
import { useAppSelector } from "@/state/hooks";
import { MatchOutcome } from "@/utils/enums";
import { useMemo, useState } from "react";
import MatchOutcomeSelector from "./MatchOutcomeSelector";
import Button from "../Button";
import BetValueSelector from "./BetValueSelector";
import { formatNumber, potentialWinnings } from "@/utils/common";
import type { Match } from "@/models/match.type";

interface AdvancementBetModuleProps {
  match: Match;
  onSave: (betValue: number, selectedOutcome: MatchOutcome, editMode: boolean) => void;
  loading?: boolean;
  initBetValue?: number;
  initSelectedOutcome?: MatchOutcome;
  editMode?: boolean;
}

const AdvancementBetModule = ({
  match,
  onSave,
  loading,
  initBetValue = 1000,
  initSelectedOutcome,
  editMode = false,
}: AdvancementBetModuleProps) => {
  const { config } = useConfig();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { userFavoriteTeam } = useGame();
  const [betValue, setBetValue] = useState<number>(initBetValue);
  const [selectedOutcome, setSelectedOutcome] = useState<MatchOutcome | null>(
    initSelectedOutcome || null
  );

  const userScore = useMemo(() => {
    return currentUser ? currentUser.data.availableScore : 0;
  }, [currentUser]);

  const isValidBet = useMemo(
    () => betValue > 0 && selectedOutcome !== null,
    [betValue, selectedOutcome]
  );

  const subText = useMemo(() => {
    if (editMode) return "";
    if (userScore < 99) {
      return "Nincs elég pontod a fogadáshoz";
    }
    return `Elérhető pontjaid: ${userScore}`;
  }, [userScore, editMode]);

  const selectedOdds = useMemo(() => {
    if (selectedOutcome === MatchOutcome.home) return match.oddsAwin || 0;
    if (selectedOutcome === MatchOutcome.draw) return match.oddsDraw || 0;
    return match.oddsBwin || 0;
  }, [match.oddsAwin, match.oddsBwin, match.oddsDraw, selectedOutcome]);

  return (
    <>
      {userFavoriteTeam(match) && (
        <div className="text-center text-xs text-green-600">
          Kedvenc csapatod játszik! Minden odds-ra plusz {config?.favoritTeamFactor}x szorzó jár
        </div>
      )}

      <MatchOutcomeSelector
        selectedOutcome={selectedOutcome}
        onSelectOutcome={setSelectedOutcome}
        match={match}
        showDraw={false}
      />

      <BetValueSelector betValue={betValue} onChangeBetValue={setBetValue} userScore={userScore} />

      {isValidBet && (
        <div className="flex justify-center items-center gap-2 mt-3">
          <div className="text-md">Várható nyereményed: </div>
          <div className="font-bold text-md text-green-500">
            {formatNumber(
              potentialWinnings(
                betValue,
                selectedOdds,
                userFavoriteTeam(match) ? config?.favoritTeamFactor : 1
              )
            )}
            <span className="pl-1 text-base font-normal text-gray-400">pont</span>
          </div>
        </div>
      )}

      {/* Mobile: Sticky button at bottom, Desktop: Regular button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-quaternary sm:relative sm:p-0 sm:bg-transparent sm:mt-6">
        <Button
          text="Fejlesztés alatt 🚧"
          // text={editMode ? "Mentés" : "LÉTREHOZÁS"}
          subText={subText}
          onClick={() => selectedOutcome && onSave(betValue, selectedOutcome, editMode)}
          className={`${
            editMode ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          } w-full py-3 sm:py-2`}
          // disabled={!isValidBet || loading || (userScore < 99 && !editMode)}
          disabled
          loading={loading}
        />
      </div>
    </>
  );
};

export default AdvancementBetModule;
