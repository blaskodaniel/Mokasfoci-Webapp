import BetModalDesktop from "@/components/BetModal/Desktop";
import MatchCard from "@/components/MatchCard";
import MatchListItem from "@/components/MatchListItem";
import Panel from "@/components/Panel";
import {
  useUpcomingMatches,
  useRecentMatches,
  matchesKeys,
  useLiveMatches,
} from "@/hooks/api/useMatches";
import { playersKeys } from "@/hooks/api/usePlayers";
import type { Match } from "@/models/match.type";
import Api from "@/services/service";
import { getMeAction } from "@/state/authSlice";
import { useAppDispatch } from "@/state/hooks";
import type { MatchOutcome } from "@/utils/enums";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import ToplistWidget from "@/components/Widgets/ToplistWidget";
import Slider from "@/components/Slider";
import useResponsive from "@/hooks/useResponsive";
import { ApiError } from "@/utils/apiError";
import { useNotification } from "@/hooks/useNotification";

const HomePage = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const { isMobile } = useResponsive();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const upcomingMatchesLength = 5;

  // Frissítjük az összes query-t amikor a komponens mount-olódik
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: matchesKeys.upcoming() });
    queryClient.invalidateQueries({ queryKey: matchesKeys.recent() });
    queryClient.invalidateQueries({ queryKey: playersKeys.toplist() });
  }, [queryClient]);

  const { data: upcomingMatches } = useUpcomingMatches(upcomingMatchesLength);

  const {
    data: liveMatches,
    isLoading: liveMatchesLoading,
    error: liveMatchesError,
  } = useLiveMatches();

  const { data: recentMatches, isLoading: recentLoading, error: recentError } = useRecentMatches(5);

  const onCreateCoupon = async (betAmount: number, outcome: MatchOutcome) => {
    if (!selectedMatch) return;
    try {
      setIsLoading(true);
      await Api.createBet(selectedMatch._id, betAmount, outcome);
      dispatch(getMeAction());
      setSelectedMatch(null);
    } catch (error: unknown) {
      const msg = ApiError.getErrorMessage(error);
      showError(msg);
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
            {upcomingMatches?.slice(0, upcomingMatchesLength).map((match: Match) => (
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

      <div className="flex flex-col md:flex-row gap-3 px-1 sm:px-4 mb-3">
        <Panel
          title="Folyamatban lévő meccsek"
          className="flex-1"
          wrapperClassName="p-1"
          loading={liveMatchesLoading}
          error={liveMatchesError?.message ? "Error loading live matches" : undefined}
        >
          {liveMatches && liveMatches.length > 0 && (
            <div className="px-1 py-3">
              {liveMatches.map((match: Match) => (
                <MatchListItem
                  key={match._id}
                  match={match}
                  onSelectMatch={setSelectedMatch}
                  displayStatusBadge
                  onRowClick={(match: Match) => {
                    navigate(`/merkozesek/${match._id}`);
                  }}
                />
              ))}
            </div>
          )}
          {liveMatches && liveMatches.length === 0 && (
            <div className="p-4 text-gray-500 text-xs text-center">
              Most éppen nincs futó mérkőzés{" "}
            </div>
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
                  <MatchListItem match={match} />
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
