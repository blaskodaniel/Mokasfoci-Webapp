import { APP_CONFIG } from "@/config";
import useResponsive from "@/hooks/useResponsive";
import type { Match } from "@/models/match.type";
import { getMatchTypeText } from "@/utils/common";
import { format } from "date-fns";
import { FaQuestion } from "react-icons/fa";
import BetModal from "../BetModal";
import { useState } from "react";
import type { MatchWithUserBet } from "../Matches/types";
import { useMyBets } from "@/hooks/api/usePlayers";
import { MatchStatus } from "@/utils/enums";

interface Round {
  id: string;
  title: string;
  matches: Match[];
}

const BracketComponent = ({
  rounds = [],
  thirdPlaceMatch,
  positionVector,
}: {
  rounds: Round[];
  thirdPlaceMatch?: Match;
  positionVector: number[];
}) => {
  const { isMobile } = useResponsive();
  const { data: myBets } = useMyBets();
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUserBet | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);

  const MatchBox = ({
    match,
    isSmall,
    hasUserBet,
    onClick,
  }: {
    match: Match;
    isSmall?: boolean;
    hasUserBet?: boolean;
    onClick?: (e: React.MouseEvent) => void;
  }) => {
    const isTeamAAdvancing =
      !!match.advancingTeam && match.advancingTeam._id === match.teamA?._id;
    const isTeamBAdvancing =
      !!match.advancingTeam && match.advancingTeam._id === match.teamB?._id;
    const advancingRowClass = "bg-emerald-500/15 -mx-2 px-2 rounded-md";

    return (
      <div
        onClick={onClick}
        className={`relative flex flex-col justify-center my-2 bg-[#1e2338] rounded-xl
        border shadow-lg shrink-0 transition-transform duration-300
        hover:-translate-y-1 ${onClick ? "cursor-pointer" : ""}
        ${hasUserBet ? "border-emerald-600/60" : "border-[#2d3148]"}
        ${isSmall ? "w-40 sm:w-48 p-2" : "w-48 sm:w-56 p-3"}`}
      >
      <div className="flex justify-between items-center mb-2">
        <div className={`text-gray-400 truncate ${isSmall ? "text-[9px]" : "text-[10px]"}`}>
          {match?.date ? format(new Date(match.date), "MMMM d. HH:mm") : "Ismeretlen időpont"}{" "}
          <span>({match.position})</span>
        </div>
        {match.type && (
          <div
            className={`text-amber-500 font-bold bg-amber-500/10 rounded ${isSmall ? "text-[9px] px-1 py-0.5" : "text-[10px] px-1.5 py-0.5"}`}
          >
            {getMatchTypeText(match.type)}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 w-full relative z-10">
        <div
          className={`flex justify-between items-center py-1 border-b border-[#2d3148]/50 ${
            isTeamAAdvancing ? advancingRowClass : ""
          }`}
        >
          <div className="flex items-center gap-2">
            {match.teamA?.flag ? (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${match.teamA.flag}`}
                alt="Flag"
                className="w-5 h-5 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-700"
              />
            ) : (
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-700 border border-gray-600 shadow-sm text-gray-300 text-[10px]">
                <FaQuestion />
              </div>
            )}
            <span
              className={`text-sm font-semibold truncate pr-2 ${
                isTeamAAdvancing ? "text-emerald-300" : "text-white"
              }`}
            >
              {match.teamA?.name || match.teamAPlaceholder || "???"}
            </span>
          </div>

          <span className="text-gray-400 font-bold bg-[#141829] px-2 py-0.5 rounded text-sm">
            {match.goalA ?? "-"}
          </span>
        </div>
        <div
          className={`flex justify-between items-center py-1 ${
            isTeamBAdvancing ? advancingRowClass : ""
          }`}
        >
          <div className="flex items-center gap-2">
            {match.teamB?.flag ? (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${match.teamB.flag}`}
                alt="Flag"
                className="w-5 h-5 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-700"
              />
            ) : (
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-700 border border-gray-600 shadow-sm text-gray-300 text-[10px]">
                <FaQuestion />
              </div>
            )}
            <span
              className={`text-sm font-semibold truncate pr-2 ${
                isTeamBAdvancing ? "text-emerald-300" : "text-white"
              }`}
            >
              {match.teamB?.name || match.teamBPlaceholder || "???"}
            </span>
          </div>

          <span className="text-gray-400 font-bold bg-[#141829] px-2 py-0.5 rounded text-sm">
            {match.goalB ?? "-"}
          </span>
        </div>
      </div>
      {match.comment && <div className="text-xs text-gray-400">{match.comment}</div>}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col relative pb-10">
      <div className="text-white text-center sm:text-left text-xl sm:text-2xl pb-4 font-bold">
        Kieséses szakasz
      </div>

      {rounds.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center flex-1 min-h-[500px]
         bg-[#141829]/50 rounded-xl border border-white/5 text-gray-400 p-6 text-center"
        >
          <svg
            className="w-16 h-16 mb-4 text-gray-500 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-lg text-white font-semibold">A kieséses szakasz még nem alakult ki</p>
          <p className="text-sm mt-2 max-w-sm">
            A csoportkörök végén itt találod majd a továbbjutott csapatok ágrajzát.
          </p>
        </div>
      ) : (
        <>
          {/* Konténer ami engedi a horizontális scrollt */}
          <div className="relative w-full overflow-x-auto min-h-[500px] flex-1 hide-scrollbar rounded-xl border border-white/5 bg-black/10">
            {/* A fa szerkezet, flex containerrel. Space-between miatt eloszlanak horizontálisan. */}
            <div className="flex flex-row p-6 gap-8 min-w-max h-auto items-stretch">
              {rounds.map((round, rIndex) => (
                <div key={round.id} className="flex flex-col flex-1 min-w-[200px] relative">
                  {/* Forduló címsor */}
                  <div className="text-center text-emerald-400 font-bold text-sm tracking-wider uppercase mb-8 sticky top-0 bg-[#0f1220]/80 backdrop-blur-md rounded-lg py-2">
                    {round.title}
                  </div>

                  {/* Mérkőzések */}
                  <div className="flex flex-col justify-around flex-1 h-full relative z-10">
                    {[...round.matches]
                      .sort((a, b) => {
                        const aPos = a.position != null ? positionVector.indexOf(a.position) : -1;
                        const bPos = b.position != null ? positionVector.indexOf(b.position) : -1;
                        const aOrder = aPos === -1 ? Infinity : aPos;
                        const bOrder = bPos === -1 ? Infinity : bPos;
                        return aOrder - bOrder;
                      })
                      .map((match) => {
                        const hasUserBet = myBets?.some((bet) => bet.matchid._id === match._id);

                        const handleMatchClick = (m: Match) => (e?: React.MouseEvent) => {
                          e?.stopPropagation();
                          if (!m?.teamA || !m?.teamB) return;
                          if (!myBets) return;
                          if (!m.date) return;
                          if (m.status !== MatchStatus.enabled) return;
                          const userBet = myBets.filter((bet) => bet.matchid._id === m._id);
                          setSelectedMatch({
                            ...m,
                            userbet: userBet,
                          });
                          setIsBetModalOpen(true);
                        };

                        return (
                          <div key={match._id} className="flex flex-col items-center relative">
                            <MatchBox
                              match={match}
                              hasUserBet={hasUserBet}
                              onClick={
                                match?.teamA && match?.teamB ? handleMatchClick(match) : undefined
                              }
                            />
                            {rIndex === rounds.length - 1 && thirdPlaceMatch && (
                              <div className="mt-8 sm:mt-12">
                                <MatchBox
                                  match={thirdPlaceMatch}
                                  isSmall={true}
                                  hasUserBet={myBets?.some(
                                    (bet) => bet.matchid._id === thirdPlaceMatch._id
                                  )}
                                  onClick={
                                    thirdPlaceMatch?.teamA && thirdPlaceMatch?.teamB
                                      ? handleMatchClick(thirdPlaceMatch)
                                      : undefined
                                  }
                                />
                              </div>
                            )}
                            {/* Összekötő vonalak - Csak a fő ág kap vonalakat */}
                            {rIndex < rounds.length - 1 && (
                              <div className="hidden sm:block absolute -right-4 w-4 h-[2px] bg-[#3a3f5a] top-1/2 -translate-y-1/2 z-0" />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll instruction for mobile */}
          {isMobile && (
            <div className="text-center text-xs text-gray-500 mt-4 animate-pulse">
              ← Lapozz oldalra a teljes ágrajz megtekintéséhez →
            </div>
          )}
        </>
      )}

      {selectedMatch && (
        <BetModal
          key={selectedMatch._id}
          match={selectedMatch}
          isOpen={isBetModalOpen}
          onClose={() => setIsBetModalOpen(false)}
          onAfterClose={() => setSelectedMatch(null)}
          bets={myBets || []}
        />
      )}
    </div>
  );
};

export default BracketComponent;
