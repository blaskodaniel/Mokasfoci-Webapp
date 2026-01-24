import { useMemo, useState, type FC } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { MatchOutcome, MatchType } from "@/utils/enums";
import type { BetModalProps } from "./types";
import { useAppSelector } from "@/state/hooks";
import useGame from "@/hooks/useGame";
import { useConfig } from "@/hooks/useConfig";
import { formatNumber, potentialWinnings } from "@/utils/common";
import MatchTeamsPanel from "./MatchTeamsPanel";
import MatchOutcomeSelector from "./MatchOutcomeSelector";
import BetValueSelector from "./BetValueSelector";
import GroupStandings from "../Widgets/GroupStandings";
import { useGetGroupStandingsById } from "@/hooks/api/useTeams";

const BetModalDesktop: FC<BetModalProps & { onAfterClose?: () => void }> = ({
  isOpen,
  onClose,
  onSave,
  match,
  loading = false,
  initBetValue = 1000,
  initSelectedOutcome,
  editMode = false,
  onAfterClose,
}) => {
  const { config } = useConfig();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { userFavoriteTeam } = useGame();
  const [betValue, setBetValue] = useState<number>(initBetValue);
  const [selectedOutcome, setSelectedOutcome] = useState<MatchOutcome | null>(
    initSelectedOutcome || null
  );

  const teamStandingsQuery = useGetGroupStandingsById(String(match.teamA?.groupid ?? ""));

  const groupName = useMemo(() => {
    return teamStandingsQuery.data && teamStandingsQuery.data?.length > 0
      ? teamStandingsQuery.data[0].groupid.name
      : "";
  }, [teamStandingsQuery]);

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

  if (!match) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? "Fogadás módosítása" : "Fogadás létrehozása"}
      className="sm:w-[455px] bg-primary px-4 py-3 sm:mx-3"
      onAfterClose={onAfterClose}
    >
      <div className="flex flex-col gap-2 mt-2 flex-1 sm:flex-none">
        <MatchTeamsPanel match={match} />

        {userFavoriteTeam(match) && (
          <div className="text-center text-xs text-green-600">
            Kedvenc csapatod játszik! Minden odds-ra plusz {config?.favoritTeamFactor}x szorzó jár
          </div>
        )}

        <MatchOutcomeSelector
          selectedOutcome={selectedOutcome}
          onSelectOutcome={setSelectedOutcome}
          match={match}
        />

        <BetValueSelector
          betValue={betValue}
          onChangeBetValue={setBetValue}
          userScore={userScore}
        />

        {isValidBet && (
          <div className="text-center mt-5">
            <div className="">Várható nyereményed</div>
            <div className="font-bold text-2xl text-green-500 pt-1">
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

        {(match.type === MatchType.GroupStageRound1 ||
          match.type === MatchType.GroupStageRound2 ||
          match.type === MatchType.GroupStageRound3) && (
          <section className="flex justify-center pt-4">
            <GroupStandings teams={teamStandingsQuery.data ?? []} groupName={groupName} size="sm" />
          </section>
        )}

        {/* Mobile: Sticky button at bottom, Desktop: Regular button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-quaternary sm:relative sm:p-0 sm:bg-transparent sm:mt-6">
          <Button
            text={editMode ? "Mentés" : "LÉTREHOZÁS"}
            subText={subText}
            onClick={() => selectedOutcome && onSave(betValue, selectedOutcome, editMode)}
            className={`${
              editMode ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            } w-full py-3 sm:py-2`}
            disabled={!isValidBet || loading || (userScore < 99 && !editMode)}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default BetModalDesktop;
