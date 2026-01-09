import BetModalDesktop from "@/components/BetModal/Desktop";
import MatchCard from "@/components/MatchCard";
import MatchWithBets from "@/components/MatchWithBets";
import Panel from "@/components/Panel";
import { useUpcomingMatches, useRecentMatches, matchesKeys } from "@/hooks/api/useMatches";
import { playersKeys } from "@/hooks/api/usePlayers";
import type { Match } from "@/models/match.type";
import Api from "@/services/service";
import { getMeAction } from "@/state/authSlice";
import { useAppDispatch } from "@/state/hooks";
import type { MatchOutcome } from "@/utils/enums";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ToplistWidget from "@/components/Widgets/ToplistWidget";
import Slider from "@/components/Slider";
import useResponsive from "@/hooks/useResponsive";

const HomePage = () => {
  const { isMobile } = useResponsive();
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
      <section className="mt-6 mb-5">
        <h1 className="text-2xl font-bold text-white px-4 hidden sm:block">Kiemelt</h1>
        <section className="mt-6 px-4">
          <Slider itemsPerView={isMobile ? 1 : 3} gap={16}>
            {upcomingMatches?.slice(0, 3).map((match: Match) => (
              <MatchCard
                key={match._id}
                match={match}
                onClick={() => {
                  setSelectedMatch(match);
                }}
              />
            ))}
          </Slider>
        </section>
      </section>

      <div className="flex flex-col md:flex-row gap-3 px-1 sm:px-4">
        <Panel
          title="Legközelebbi mérkőzések"
          className="flex-1"
          wrapperClassName="p-1"
          loading={upcomingLoading}
          error={upcomingError?.message ? "Error loading upcoming matches" : undefined}
        >
          {upcomingMatches && upcomingMatches.length > 0 && (
            <div className="px-1 py-3">
              {upcomingMatches.map((match: Match) => (
                <MatchWithBets key={match._id} match={match} />
              ))}
            </div>
          )}
          {upcomingMatches && upcomingMatches.length === 0 && (
            <div className="p-4 text-gray-500">Nincsenek közelgő mérkőzések</div>
          )}
        </Panel>

        <ToplistWidget />

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
                  className="block mb-2 last:mb-0 border-b last:border-0 border-gray-700/30"
                >
                  <MatchWithBets match={match} />
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>

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
