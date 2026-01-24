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
import { playersKeys, useCreateBet, useMyBets, useUpdateBet } from "@/hooks/api/usePlayers";
import type { Match } from "@/models/match.type";
import type { MatchOutcome } from "@/utils/enums";
import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import ToplistWidget from "@/components/Widgets/ToplistWidget";
import Slider from "@/components/Slider";
import useResponsive from "@/hooks/useResponsive";
import { ApiError } from "@/utils/apiError";
import { useNotification } from "@/hooks/useNotification";
import type { MatchWithUserBet } from "@/components/Matches/types";
import WelcomePanel from "@/components/WelcomePanel";
import { useConfig } from "@/hooks/useConfig";
import { isBefore } from "date-fns";

const HomePage = () => {
  const { config } = useConfig();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const { isMobile } = useResponsive();
  const queryClient = useQueryClient();
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUserBet | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const upcomingMatchesLength = 5;

  const updateBetMutation = useUpdateBet();
  const createBetMutation = useCreateBet();

  // Frissítjük az összes query-t amikor a komponens mount-olódik
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: matchesKeys.upcoming() });
    queryClient.invalidateQueries({ queryKey: matchesKeys.recent() });
    queryClient.invalidateQueries({ queryKey: playersKeys.toplist() });
    queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
  }, [queryClient]);

  const { data: upcomingMatches } = useUpcomingMatches(upcomingMatchesLength);

  const {
    data: liveMatches,
    isLoading: liveMatchesLoading,
    error: liveMatchesError,
  } = useLiveMatches();

  const { data: recentMatches, isLoading: recentLoading, error: recentError } = useRecentMatches(5);
  const { data: myBets } = useMyBets();

  const upcomingMatchesWithBets = useMemo(() => {
    if (!upcomingMatches) return [];
    if (!myBets) return upcomingMatches;
    return upcomingMatches.map((match) => ({
      ...match,
      userbet: myBets.find((b) => b.matchid._id === match._id),
    }));
  }, [upcomingMatches, myBets]);

  const onSubmitCouponHandling = async (
    betAmount: number,
    outcome: MatchOutcome,
    editMode: boolean
  ) => {
    if (!selectedMatch) return;

    if (editMode && selectedMatch.userbet) {
      // Update bet
      updateBetMutation.mutate(
        {
          betId: selectedMatch.userbet._id,
          data: {
            amount: betAmount,
            outcome: outcome,
          },
        },
        {
          onSuccess: () => {
            setIsBetModalOpen(false);
            showSuccess("Frissítettük a fogadásodat!");
            queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
          },
          onError: (error) => {
            console.error("Error updating bet:", error);
            showError("A fogadás frissítése sikertelen volt.");
          },
        }
      );
    } else {
      // Create bet
      createBetMutation.mutate(
        {
          matchId: selectedMatch._id,
          betAmount,
          outcome,
        },
        {
          onSuccess: () => {
            setIsBetModalOpen(false);
            queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
            showSuccess("A fogadásod sikeresen létrehoztuk.");
          },
          onError: (error) => {
            const msg = ApiError.getErrorMessage(error);
            showError(msg);
          },
        }
      );
    }
  };

  return (
    <div>
      {isBefore(new Date(), new Date(config?.championStartDate || "")) && (
        <section className="w-full px-3">
          <WelcomePanel />
        </section>
      )}
      <section className="mt-6 mb-5">
        <h1 className="text-2xl font-bold text-white px-4 hidden sm:block">Hamarosan játszák</h1>
        <section className="mt-6 px-4">
          <Slider itemsPerView={isMobile ? 1 : 3} gap={16}>
            {upcomingMatchesWithBets
              ?.slice(0, upcomingMatchesLength)
              .map((match: MatchWithUserBet) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  onClick={() => {
                    setSelectedMatch(match);
                    setIsBetModalOpen(true);
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
                  onSelectMatch={(m) => {
                    setSelectedMatch(m as MatchWithUserBet);
                    setIsBetModalOpen(true);
                  }}
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
          {liveMatches && liveMatches.length === 0 && (
            <div className="p-4 text-gray-500 text-xs text-center">
              Még nem játszottak le mérkőzést{" "}
            </div>
          )}
        </Panel>
      </div>

      {selectedMatch && (
        <BetModalDesktop
          key={selectedMatch._id}
          match={selectedMatch}
          isOpen={isBetModalOpen}
          onClose={() => setIsBetModalOpen(false)}
          onAfterClose={() => setSelectedMatch(null)}
          onSave={onSubmitCouponHandling}
          loading={updateBetMutation.isPending || createBetMutation.isPending}
          editMode={!!selectedMatch.userbet}
          initBetValue={selectedMatch?.userbet?.amount}
          initSelectedOutcome={selectedMatch?.userbet?.outcome}
        />
      )}
    </div>
  );
};
export default HomePage;
