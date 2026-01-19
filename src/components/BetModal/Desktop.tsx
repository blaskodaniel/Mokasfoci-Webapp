import { useMemo, useState, type FC } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { APP_CONFIG } from "@/config";
import { MatchOutcome } from "@/utils/enums";
import type { BetModalProps } from "./types";
import { useAppSelector } from "@/state/hooks";

const BetModalDesktop: FC<BetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  match,
  loading = false,
  initBetValue = 1000,
  initSelectedOutcome,
  editMode = false,
}) => {
  const { currentUser } = useAppSelector((state) => state.auth);
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

  if (!match) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? "Fogadás szerkesztése" : "Fogadás létrehozása"}
      className="sm:w-[455px] bg-primary px-4 py-3 sm:mx-3"
    >
      <div className="flex flex-col gap-2 mt-2 flex-1 sm:flex-none">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            {match.teamA?.flag && (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${match.teamA.flag}`}
                alt={`${match.teamA.name} flag`}
                className="w-12 h-12 object-cover rounded-full"
              />
            )}
            <span className="text-lg">{match.teamA?.name}</span>
          </div>
          <div>vs.</div>
          <div className="flex-1 flex flex-col justify-center items-center gap-4">
            {match.teamB?.flag && (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${match.teamB.flag}`}
                alt={`${match.teamB.name} flag`}
                className="w-12 h-12 object-cover rounded-full"
              />
            )}
            <span className="text-lg">{match.teamB?.name}</span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 sm:gap-5 px-1 sm:px-6">
          <div
            onClick={() => setSelectedOutcome(MatchOutcome.home)}
            className={`px-3 py-1 rounded-md border text-center text-sm font-medium flex-1 
              cursor-pointer transition-colors duration-300 ${
                selectedOutcome === MatchOutcome.home
                  ? "bg-button-light text-white border-primary"
                  : "border-gray-300/20 hover:bg-primary/20"
              }`}
          >
            <p>{match.teamA?.name}</p> <p>{match.oddsAwin}</p>
          </div>
          <div
            onClick={() => setSelectedOutcome(MatchOutcome.draw)}
            className={`px-3 py-1 rounded-md border text-center text-sm font-medium flex-1 
              cursor-pointer transition-colors duration-300 ${
                selectedOutcome === MatchOutcome.draw
                  ? "bg-button-light text-white border-primary"
                  : "border-gray-300/20 hover:bg-primary/20"
              }`}
          >
            <p>döntetlen</p> <p>{match.oddsDraw}</p>
          </div>
          <div
            onClick={() => setSelectedOutcome(MatchOutcome.away)}
            className={`px-3 py-1 rounded-md border text-center text-sm font-medium flex-1 
              cursor-pointer transition-colors duration-300 ${
                selectedOutcome === MatchOutcome.away
                  ? "bg-button-light text-white border-primary"
                  : "border-gray-300/20 hover:bg-primary/20"
              }`}
          >
            <p>{match.teamB?.name}</p> <p>{match.oddsBwin}</p>
          </div>
        </div>

        <div className="mt-6 flex-1 sm:flex-none">
          <label className="block text-sm font-medium mb-3 text-center">Feltett tét</label>
          <div className="flex justify-center items-center gap-4">
            <button
              type="button"
              aria-label="Csökkentés"
              className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-2xl flex items-center justify-center shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setBetValue((v) => Math.max(100, v - 100))}
              disabled={betValue <= 100}
            >
              –
            </button>
            <span className="text-2xl font-bold min-w-[70px] text-center bg-gray-800 rounded-lg px-4 py-2 border border-gray-600 select-none">
              {betValue} <span className="text-base font-normal text-gray-400">pont</span>
            </span>
            <button
              type="button"
              aria-label="Növelés"
              className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-2xl flex items-center justify-center shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setBetValue((v) => Math.min(userScore, v + 100))}
              disabled={betValue + 100 > 2000}
            >
              +
            </button>
          </div>
        </div>

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
