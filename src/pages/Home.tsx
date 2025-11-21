import CreateBetModalDesktop from "@/components/CreateBetModal/Desktop";
import MatchCard from "@/components/MatchCard";
import MatchInLine from "@/components/MatchInLine";
import MatchWithBets from "@/components/MatchWithBets";
import Panel from "@/components/Panel";
import { useUpcomingMatches, useRecentMatches } from "@/hooks/api/useMatches";
import { useTopScorers } from "@/hooks/api/usePlayers";
import type { Match } from "@/models/match.type";
import type { User } from "@/models/user.type";
import { useState } from "react";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

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
    data: topScorers,
    isLoading: scorersLoading,
    error: scorersError,
  } = useTopScorers(5);

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
          loading={scorersLoading}
          error={
            scorersError?.message ? "Error loading top scorers" : undefined
          }
        >
          {topScorers && topScorers.length > 0 && (
            <div className="p-4">
              {topScorers.map((player: User, index: number) => (
                <div key={player._id} className="mb-2 flex justify-between">
                  <span>
                    {index + 1}. {player.name}
                  </span>
                  <span>2500 pont</span>
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
              setIsModalOpen(true);
            }}
          />
        ))}
      </section>

      <CreateBetModalDesktop
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedMatch={selectedMatch!}
      />
    </div>
  );
};
export default HomePage;
