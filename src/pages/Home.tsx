import BetModalDesktop from "@/components/BetModal/Desktop";
import MatchCard from "@/components/MatchCard";
import MatchWithBets from "@/components/MatchWithBets";
import Panel from "@/components/Panel";
import { useUpcomingMatches, useRecentMatches, matchesKeys } from "@/hooks/api/useMatches";
import { useToplist, playersKeys } from "@/hooks/api/usePlayers";
import type { Match } from "@/models/match.type";
import type { User } from "@/models/user.type";
import Api from "@/services/service";
import { getMeAction } from "@/state/authSlice";
import { useAppDispatch } from "@/state/hooks";
import type { MatchOutcome } from "@/utils/enums";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import UserDisplay from "@/components/UserDisplay";
import { formatPoints } from "@/utils/common";
import BalanceHistoryChart from "@/components/Charts/BalanceHistoryChart";
import WinLostChart from "@/components/Charts/WinLostChart";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Frissítjük az összes query-t amikor a komponens mount-olódik
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: matchesKeys.upcoming() });
    queryClient.invalidateQueries({ queryKey: matchesKeys.recent() });
    queryClient.invalidateQueries({ queryKey: playersKeys.toplist() });
  }, [queryClient]);

  const {
    data: upcomingMatches,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useUpcomingMatches(3);

  const { data: recentMatches, isLoading: recentLoading, error: recentError } = useRecentMatches(5);

  const { data: toplist, isLoading: toplistLoading, error: toplistError } = useToplist();

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
      <div className="flex flex-col md:flex-row gap-3 px-1 sm:px-4">
        <Panel
          title="Legközelebbi mérkőzések"
          className="flex-1"
          loading={upcomingLoading}
          error={upcomingError?.message ? "Error loading upcoming matches" : undefined}
        >
          {upcomingMatches && upcomingMatches.length > 0 && (
            <div className="p-1">
              {upcomingMatches.map((match: Match) => (
                <MatchWithBets key={match._id} match={match} />
              ))}
            </div>
          )}
          {upcomingMatches && upcomingMatches.length === 0 && (
            <div className="p-4 text-gray-500">Nincsenek közelgő mérkőzések</div>
          )}
        </Panel>

        <Panel
          title="Top 3 játékos"
          className="flex-1"
          loading={toplistLoading}
          error={toplistError?.message ? "Error loading top scorers" : undefined}
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
              <hr className="my-2 border-gray-700" />
              <div className="space-y-3">
                {toplist.slice(0, 3).map((player: User, index: number) => (
                  <div key={player._id} className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="bg-black/20 text-xs rounded-full px-1.5 py-1">
                        {index + 1}.
                      </div>
                      <UserDisplay user={player} showAvatar={true} avatarSize="xs" />
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 text-right text-sm">
                        {formatPoints(player.data.availableScore, false)}
                      </div>
                      <div className="w-16 text-right text-sm">
                        {formatPoints(player.data.profitScore, false)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>

        <Panel
          title="Legutóbbi eredmények"
          className="flex-1"
          loading={recentLoading}
          error={recentError?.message ? "Error loading recent results" : undefined}
        >
          {recentMatches && recentMatches.length > 0 && (
            <div className="p-2">
              {recentMatches.slice(0, 5).map((match: Match) => (
                <Link
                  to={`/merkozesek/${match._id}`}
                  key={match._id}
                  className="block mb-2 last:mb-0"
                >
                  <MatchWithBets match={match} />
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-8">
        <div className="flex-1">
          <BalanceHistoryChart />
        </div>
        <div className="flex-1">
          <WinLostChart />
        </div>
      </div>

      <section className="mt-6">
        <h1 className="text-2xl font-bold text-white px-4">Kiemelt</h1>
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
