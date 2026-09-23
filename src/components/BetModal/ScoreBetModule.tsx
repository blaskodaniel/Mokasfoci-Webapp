import { useMemo, useState, useEffect } from "react";
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

  const maxAllowedScore = useMemo(() => {
    return editMode ? userScore + initBetValue : userScore;
  }, [userScore, editMode, initBetValue]);

  useEffect(() => {
    if (!editMode && betValue > maxAllowedScore && maxAllowedScore > 0) {
      setBetValue(Math.max(100, Math.floor(maxAllowedScore / 100) * 100));
    }
  }, [maxAllowedScore, editMode, betValue]);

  const subText = useMemo(() => {
    if (editMode) return "";
    if (userScore < 99) {
      return "Nincs elég pontod a fogadáshoz";
    }
    return `Felhasználható pontod: ${formatNumber(userScore)} pont`;
  }, [userScore, editMode]);

  const isValidBet = useMemo(() => {
    return homeScore !== "" && awayScore !== "" && betValue >= 100 && betValue <= maxAllowedScore;
  }, [homeScore, awayScore, betValue, maxAllowedScore]);

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

      <BetValueSelector betValue={betValue} onChangeBetValue={setBetValue} maxAllowedScore={maxAllowedScore} />

      <section className="my-4 overflow-hidden rounded-tile border border-tile-border bg-black/20">
        <div className="flex items-center justify-between border-b border-tile-border bg-white/[0.03] px-3 py-2.5">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
              Nyerési lehetőségek
            </div>
            <div className="mt-0.5 text-[10px] text-text-muted">A kiválasztott tét alapján</div>
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent-soft transition-colors hover:border-accent/60 hover:bg-accent/20"
          >
            Hogyan működik?
          </button>
        </div>
        <div className="space-y-1.5 p-2">
          {[
            {
              label: "Telitalálat",
              odds: exactMatchOdds,
              tone: "border-badge-success-border bg-badge-success-bg text-badge-success",
            },
            {
              label: "Gólkülönbség",
              odds: goalDifferenceOdds,
              tone: "border-badge-amber-border bg-badge-amber-bg text-badge-amber",
            },
            {
              label: "Kimenetel",
              odds: outcomeOdds,
              tone: "border-accent/40 bg-accent/15 text-accent-soft",
            },
          ].map(({ label, odds, tone }, index) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-transparent px-2.5 py-2 transition-colors hover:border-tile-border hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-2.5">
                <span className={`flex size-6 items-center justify-center rounded-md border text-[10px] font-black ${tone}`}>
                  {index + 1}
                </span>
                <div>
                  <div className="text-xs font-semibold text-text-secondary">{label}</div>
                  <div className="text-[10px] text-text-muted">{odds}x szorzó</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-black tabular-nums ${tone.split(" ").at(-1)}`}>
                  {formatNumber(betValue * odds)}
                </div>
                <div className="text-[10px] text-text-muted">pont</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 mt-4 border-t border-tile-border bg-[image:var(--tile-bg-gradient)] px-4 py-3">
        <Button
          text={editMode ? "Mentés" : "Fogadás létrehozása"}
          subText={subText}
          variant="cta"
          onClick={() =>
            isValidBet && onSave(betValue, Number(homeScore), Number(awayScore), editMode)
          }
          className="w-full"
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
