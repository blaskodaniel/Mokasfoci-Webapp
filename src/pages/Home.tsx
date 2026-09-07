import MatchCard from "@/components/MatchCard";
import MatchListItem from "@/components/MatchListItem";
import Tile from "@/components/ui/Tile";
import Badge from "@/components/ui/Badge";
import { IoRadioOutline, IoTimeOutline } from "react-icons/io5";
import {
  useUpcomingMatches,
  useRecentMatches,
  matchesKeys,
  useLiveMatches,
} from "@/hooks/api/useMatches";
import { playersKeys, useMyBets } from "@/hooks/api/usePlayers";
import type { Match } from "@/models/match.type";
import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import ToplistWidget from "@/components/Widgets/ToplistWidget";
import Slider from "@/components/Slider";
import useResponsive from "@/hooks/useResponsive";
import type { MatchWithUserBet } from "@/components/Matches/types";
import WelcomePanel from "@/components/WelcomePanel";
import TournamentEndPanel from "@/components/TournamentEndPanel";
import { useAllTeams } from "@/hooks/api/useTeams";
import { useConfig } from "@/hooks/useConfig";
import { isBefore, subDays } from "date-fns";
import BetModal from "@/components/BetModal";
import { getMatchTypeText } from "@/utils/common";
import { MatchType } from "@/utils/enums";

const HomePage = () => {
  const { config } = useConfig();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  const upcomingItemsPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const queryClient = useQueryClient();
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUserBet | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const upcomingMatchesLength = 5;

  // Frissítjük az összes query-t amikor a komponens mount-olódik
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: matchesKeys.upcoming() });
    queryClient.invalidateQueries({ queryKey: matchesKeys.recent() });
    queryClient.invalidateQueries({ queryKey: playersKeys.toplist() });
    queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
  }, [queryClient]);

  const { data: upcomingMatches } = useUpcomingMatches(upcomingMatchesLength);
  const { data: teams } = useAllTeams();

  const isTournamentOver = useMemo(() => {
    if (!teams) return false;
    return teams.some((t) => t.isTournamentWinner);
  }, [teams]);

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
      userbet: myBets.filter((b) => b.matchid._id === match._id),
    }));
  }, [upcomingMatches, myBets]);

  // Szinkronizáljuk a selectedMatch-et a frissült adatokkal amikor változnak az odds-ok
  useEffect(() => {
    if (selectedMatch && isBetModalOpen) {
      const updatedMatch = upcomingMatchesWithBets.find((m) => m._id === selectedMatch._id);
      if (updatedMatch) {
        setSelectedMatch(updatedMatch);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingMatchesWithBets, isBetModalOpen, selectedMatch?._id]);

  return (
    <div>
      {isBefore(new Date(), subDays(new Date(config?.championStartDate || ""), 1)) &&
        !isTournamentOver && (
          <section className="w-full px-3">
            <WelcomePanel />
          </section>
        )}

      {isTournamentOver && (
        <section className="w-full px-0 sm:px-3">
          <TournamentEndPanel />
        </section>
      )}
      <section className="mt-6 mb-5">
        <h1 className="text-2xl font-bold text-white px-4 hidden sm:flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Hamarosan játszák
        </h1>
        <section className="mt-6 px-4">
          <Slider itemsPerView={upcomingItemsPerView} gap={16}>
            {upcomingMatchesWithBets
              ?.slice(0, upcomingMatchesLength)
              .map((match: MatchWithUserBet) => {
                const badge =
                  match.type === MatchType.RoundOf32 ||
                  match.type === MatchType.RoundOf16 ||
                  match.type === MatchType.Quarterfinal ||
                  match.type === MatchType.Semifinal ||
                  match.type === MatchType.ThirdPlacePlayoff ||
                  match.type === MatchType.Final
                    ? getMatchTypeText(match.type)
                    : "";
                return (
                  <MatchCard
                    key={match._id}
                    match={match}
                    badge={badge}
                    onClick={() => {
                      if (!match.teamA || !match.teamB || !match.date) {
                        return;
                      }
                      setSelectedMatch(match);
                      setIsBetModalOpen(true);
                    }}
                  />
                );
              })}
          </Slider>
        </section>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 px-1 sm:px-4 mb-3 items-start">
        <div className="md:col-span-5">
          <Tile
            title="Folyamatban lévő meccsek"
            titleIcon={<IoRadioOutline />}
            accent="success"
            headerRight={
              liveMatches && liveMatches.length > 0 ? (
                <Badge variant="live" dot>
                  Élő
                </Badge>
              ) : undefined
            }
            loading={liveMatchesLoading}
            error={liveMatchesError?.message ? "Error loading live matches" : undefined}
          >
            {liveMatches && liveMatches.length > 0 && (
              <div className="px-2 pb-3 space-y-1">
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
              <div className="p-4 text-text-muted text-xs text-center">
                Most éppen nincs futó mérkőzés
              </div>
            )}
          </Tile>
        </div>

        <div className="md:col-span-3">
          <ToplistWidget showHeader={false} />
        </div>

        <div className="md:col-span-4">
          <Tile
            title="Legutóbbi eredmények"
            titleIcon={<IoTimeOutline />}
            accent="accent"
            loading={recentLoading}
            error={recentError?.message ? "Error loading recent results" : undefined}
          >
            {recentMatches && recentMatches.length > 0 && (
              <div className="px-2 pb-2 space-y-1">
                {recentMatches.slice(0, 5).map((match: Match) => (
                  <Link
                    to={`/merkozesek/${match._id}`}
                    key={match._id}
                    className="block last:mb-0 border-b last:border-0 border-tile-border"
                  >
                    <MatchListItem match={match} />
                  </Link>
                ))}
              </div>
            )}
            {recentMatches && recentMatches.length === 0 && (
              <div className="p-4 text-text-muted text-xs text-center">
                Még nem játszottak le mérkőzést
              </div>
            )}
          </Tile>
        </div>
      </div>

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
export default HomePage;
