import { useMemo, useState } from "react";
import Button from "../Button";
import BetValueSelector from "./BetValueSelector";
import ScoreInputSelector from "./ScoreInputSelector";
import { formatNumber } from "@/utils/common";
import type { Match } from "@/models/match.type";
import HelpModal from "../HelpModal";
import { useConfig } from "@/hooks/useConfig";
import { useAuth } from "@/hooks/useAuth";

interface ScoreBetModuleProps {
  match: Match;
  onSave: (betValue: number, homeScore: number, awayScore: number, editMode: boolean) => void;
  loading?: boolean;
  initBetValue?: number;
  initTeamAScore?: number;
  initTeamBScore?: number;
  editMode?: boolean;
}

const ScoreBetModule = ({
  match,
  onSave,
  loading,
  initBetValue = 1000,
  initTeamAScore,
  initTeamBScore,
  editMode = false,
}: ScoreBetModuleProps) => {
  const { user: currentUser } = useAuth();
  const { config } = useConfig();
  const [betValue, setBetValue] = useState<number>(initBetValue);
  const [homeScore, setHomeScore] = useState<number | "">(
    initTeamAScore !== undefined ? initTeamAScore : ""
  );
  const [awayScore, setAwayScore] = useState<number | "">(
    initTeamBScore !== undefined ? initTeamBScore : ""
  );

  const [showHelp, setShowHelp] = useState(false);

  const userScore = useMemo(() => {
    return currentUser ? currentUser.data.availableScore : 0;
  }, [currentUser]);

  const subText = useMemo(() => {
    if (editMode) return "";
    if (userScore < 99) {
      return "Nincs elég pontod a fogadáshoz";
    }
    return `Felhasználható pontod: ${formatNumber(userScore)} pont`;
  }, [userScore, editMode]);

  const isValidBet = useMemo(() => {
    return homeScore !== "" && awayScore !== "" && betValue >= 100;
  }, [homeScore, awayScore, betValue]);

  const exactMatchOdds = useMemo(() => {
    return match.additionalOdds?.scoreOdds?.exactMatch ?? config?.scoreExactMatchOdds ?? 1;
  }, [match, config]);

  const goalDifferenceOdds = useMemo(() => {
    return match.additionalOdds?.scoreOdds?.goalDifference ?? config?.scoreGoalDifferenceOdds ?? 1;
  }, [match, config]);

  const outcomeOdds = useMemo(() => {
    return match.additionalOdds?.scoreOdds?.outcome ?? config?.scoreOutcomeOdds ?? 1;
  }, [match, config]);

  return (
    <>
      <ScoreInputSelector
        match={match}
        homeScore={homeScore}
        awayScore={awayScore}
        onScoreChange={(h, a) => {
          setHomeScore(h);
          setAwayScore(a);
        }}
      />

      <BetValueSelector betValue={betValue} onChangeBetValue={setBetValue} userScore={userScore} />

      <div className="bg-secondary/50 rounded-lg p-3 my-4 space-y-2 text-sm border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-gray-300">Nyerési lehetőségek:</div>
          <button
            onClick={() => setShowHelp(true)}
            className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors"
          >
            Hogyan működik?
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span className="text-gray-400">{exactMatchOdds}x - Telitalálat:</span>
          </div>
          <div className="font-bold text-green-400">
            {formatNumber(betValue * exactMatchOdds)} pont
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>↕️</span>
            <span className="text-gray-400">{goalDifferenceOdds}x - Gólkülönbség:</span>
          </div>
          <div className="font-bold text-yellow-400">
            {formatNumber(betValue * goalDifferenceOdds)} pont
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span className="text-gray-400">{outcomeOdds}x - Kimenetel:</span>
          </div>
          <div className="font-bold text-blue-400">{formatNumber(betValue * outcomeOdds)} pont</div>
        </div>
      </div>

      {/* Mobile: Sticky button at bottom, Desktop: Regular button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-quaternary sm:relative sm:p-0 sm:bg-transparent sm:mt-6">
        <Button
          text={editMode ? "Mentés" : "LÉTREHOZÁS"}
          subText={subText}
          onClick={() =>
            isValidBet && onSave(betValue, Number(homeScore), Number(awayScore), editMode)
          }
          className={`${
            editMode ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          } w-full py-3 sm:py-2`}
          disabled={!isValidBet || loading || (userScore < 99 && !editMode)}
          loading={loading}
        />
      </div>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Pontos eredmény fogadás"
      >
        <div className="space-y-4">
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <h3 className="text-white font-semibold mb-2">Példa fogadás:</h3>
            <ul className="space-y-1 text-gray-300">
              <li>
                <span className="text-gray-400">Meccs:</span> Brazília vs Mexikó
              </li>
              <li>
                <span className="text-gray-400">Tipp:</span>{" "}
                <span className="text-white">2 : 1</span>
              </li>
              <li>
                <span className="text-gray-400">Tét:</span> 1000 pont
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2 border-b border-white/10 pb-1">
              Nyerési lehetőségek
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-xl">🎯</span>
                <div>
                  <span className="text-green-400 font-bold">{exactMatchOdds}x - Telitalálat</span>
                  <p className="text-xs text-gray-400">Ha az eredmény pontosan 2:1 lesz.</p>
                  <p className="text-sm font-medium text-green-300">
                    Nyeremény: {formatNumber(1000 * (exactMatchOdds ?? 1))} pont
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">↕️</span>
                <div>
                  <span className="text-yellow-400 font-bold">
                    {goalDifferenceOdds}x - Gólkülönbség
                  </span>
                  <p className="text-xs text-gray-400">
                    Ha az eredmény pl. 3:2 vagy 1:0 (hazai +1 gól).
                  </p>
                  <p className="text-sm font-medium text-yellow-300">
                    Nyeremény: {formatNumber(1000 * (goalDifferenceOdds ?? 1))} pont
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">✅</span>
                <div>
                  <span className="text-blue-400 font-bold">{outcomeOdds}x - Kimenetel</span>
                  <p className="text-xs text-gray-400">Ha bármilyen hazai győzelem születik.</p>
                  <p className="text-sm font-medium text-blue-300">
                    Nyeremény: {formatNumber(1000 * (outcomeOdds ?? 1))} pont
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
            <h3 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
              <span>ℹ️</span> A döntetlen eset
            </h3>
            <p className="mb-2">
              Döntetlennél a kimenetel és a gólkülönbség matematikailag ugyanaz (0). Ilyenkor a{" "}
              <span className="text-white font-semibold">magasabb szorzó</span> jár.
            </p>
            <div className="bg-black/20 p-2 rounded text-xs space-y-1">
              <p>
                <span className="text-gray-400">Tipp:</span> 1:1 ({formatNumber(1000)} pont)
              </p>
              <p>
                <span className="text-gray-400">Eredmény:</span> 1:1 →{" "}
                <span className="text-green-400">
                  Telitalálat ({formatNumber(1000 * (exactMatchOdds ?? 1))} pont)
                </span>
              </p>
              <p>
                <span className="text-gray-400">Eredmény:</span> 2:2 →{" "}
                <span className="text-yellow-400">
                  Gólkülönbség ({formatNumber(1000 * (goalDifferenceOdds ?? 1))} pont)
                </span>
              </p>
              <p className="italic text-gray-500 mt-1">
                (Mivel a döntetlen kimenetele is teljesül, de a gólkülönbség értékesebb, ezért azt
                kapja.)
              </p>
            </div>
          </div>
        </div>
      </HelpModal>
    </>
  );
};

export default ScoreBetModule;
