import BetModalDesktop from "@/components/BetModal/Desktop";
import MatchCard from "@/components/MatchCard";
import MatchInLine from "@/components/MatchInLine";
import MatchWithBets from "@/components/MatchWithBets";
import Panel from "@/components/Panel";
import { useUpcomingMatches, useRecentMatches } from "@/hooks/api/useMatches";
import { useToplist } from "@/hooks/api/usePlayers";
import type { Match } from "@/models/match.type";
import type { User } from "@/models/user.type";
import Api from "@/services/service";
import { getMeAction } from "@/state/authSlice";
import { useAppDispatch } from "@/state/hooks";
import type { MatchOutcome } from "@/utils/enums";
import { useState } from "react";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: upcomingMatches,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useUpcomingMatches(5);

  const {
    data: recentMatches,
    isLoading: recentLoading,
    error: recentError,
  } = useRecentMatches(5);

  const {
    data: toplist,
    isLoading: toplistLoading,
    error: toplistError,
  } = useToplist();

  const onCreateCoupon = async (betAmount: number, outcome: MatchOutcome) => {
    if (!selectedMatch) return;
    try {
      setIsLoading(true);
      await Api.createBet(selectedMatch._id, betAmount, outcome);
      dispatch(getMeAction());
      setSelectedMatch(null);
    } catch (error: unknown) {
      console.error("Error creating bet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 px-4">
        <Panel
          title="Legközelebbi mérkőzések"
          className="flex-1"
          loading={upcomingLoading}
          error={
            upcomingError?.message
              ? "Error loading upcoming matches"
              : undefined
          }
        >
          {upcomingMatches && upcomingMatches.length > 0 && (
            <div className="p-1">
              {upcomingMatches.map((match: Match) => (
                <MatchInLine key={match._id} match={match} />
              ))}
            </div>
          )}
          {upcomingMatches && upcomingMatches.length === 0 && (
            <div className="p-4 text-gray-500">
              Nincsenek közelgő mérkőzések
            </div>
          )}
        </Panel>

        <Panel
          title="Top 5 játékos"
          className="flex-1"
          loading={toplistLoading}
          error={
            toplistError?.message ? "Error loading top scorers" : undefined
          }
        >
          {toplist && toplist.length > 0 && (
            <div className="px-4 py-2">
              <div className="flex justify-between text-xs mb-2">
                <div className="flex gap-2">
                  <div>#</div>
                  <div>Játékos</div>
                </div>
                <div className="flex gap-4">
                  <div>Elérhető</div>
                  <div>Nyeremény</div>
                </div>
              </div>
              {toplist.slice(0, 5).map((player: User, index: number) => (
                <div key={player._id} className="mb-2 flex justify-between">
                  <div className="flex gap-2">
                    <div>{index + 1}</div>
                    <div>{player.username}</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 text-right">
                      {player.data.availableScore}
                    </div>
                    <div className="w-16 text-right">
                      {player.data.profitScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Legutóbbi eredmények"
          className="flex-1"
          loading={recentLoading}
          error={
            recentError?.message ? "Error loading recent results" : undefined
          }
        >
          {recentMatches && recentMatches.length > 0 && (
            <div className="p-2">
              {recentMatches.slice(0, 5).map((match: Match) => (
                <MatchWithBets key={match._id} match={match} />
              ))}
            </div>
          )}
        </Panel>
      </div>
      <section className="flex mt-6 px-4 gap-4 flex-wrap">
        {upcomingMatches?.slice(0, 3).map((match: Match) => (
          <MatchCard
            key={match._id}
            match={match}
            onClick={() => {
              setSelectedMatch(match);
            }}
          />
        ))}
      </section>

      {selectedMatch && (
        <BetModalDesktop
          key={selectedMatch._id}
          match={selectedMatch}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSave={onCreateCoupon}
          loading={isLoading}
        />
      )}
    </div>
  );
};
export default HomePage;
