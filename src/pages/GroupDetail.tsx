import BetModal from "@/components/BetModal";
import type { MatchWithUserBet } from "@/components/Matches/types";
import MatchListItem from "@/components/MatchListItem";
import MobileBackBar from "@/components/MobileBackBar";
import Panel from "@/components/Panel";
import GroupStandings from "@/components/Widgets/GroupStandings";
import { useGroupById } from "@/hooks/api/useGroup";
import { useMyBets } from "@/hooks/api/usePlayers";
import { useGetGroupStandingsById } from "@/hooks/api/useTeams";
import { MatchStatus } from "@/utils/enums";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const GroupDetail = () => {
  const groupId = useParams()?.id;
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUserBet | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const { data: myBets } = useMyBets();
  const {
    data: standings,
    isLoading: standingsLoading,
    isError: standingsError,
  } = useGetGroupStandingsById(groupId!);
  const { data: groupData, isLoading, isError } = useGroupById(groupId);

  const groupMatches = groupData?.matches;
  const group = groupData?.group;

  const matchesWithBets = useMemo((): MatchWithUserBet[] => {
    if (!groupMatches || !myBets) return groupMatches || [];

    const combined = groupMatches.map((match) => {
      const userBet = myBets.filter((bet) => bet.matchid._id === match._id);

      return {
        ...match,
        userbet: userBet,
      };
    });

    return combined;
  }, [groupMatches, myBets]);

  if (isLoading || standingsLoading) {
    return <div>Loading...</div>;
  }

  if (isError || standingsError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      <MobileBackBar title="Csoport részletei" />
      {/* Avatar */}
      <div className="px-1">
        <div className="pl-2 flex justify-start mb-3 gap-4 items-center">
          <div
            className="w-12 h-12 rounded-full bg-linear-to-br flex 
                      items-center justify-center text-white text-4xl font-bold cursor-pointer 
                      hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            <div className="w-full h-full rounded-full flex items-center justify-center">
              {group?.name?.charAt(0).toUpperCase() || "CS"}
            </div>
          </div>
          <div className="-ml-2">
            <div className="text-left text-xl font-semibold">csoport</div>
          </div>
        </div>

        {/* Widgets */}
        <div className="flex flex-col gap-4 sm:px-4 mb-3 px-1">
          <div className="flex gap-3 flex-col sm:flex-row">
            <Panel title="Csoport mérkőzései" className="flex-1">
              {matchesWithBets && matchesWithBets.length > 0 && (
                <div className="p-1">
                  {matchesWithBets.map((match: MatchWithUserBet) => {
                    if (
                      match.status === MatchStatus.finished ||
                      match.status === MatchStatus.playing
                    ) {
                      return (
                        <Link to={`/merkozesek/${match._id}`} key={match._id}>
                          <MatchListItem match={match} />
                        </Link>
                      );
                    }

                    return (
                      <MatchListItem
                        match={match}
                        key={match._id}
                        displayTime
                        displayDate
                        onSelectMatch={(m: MatchWithUserBet) => {
                          console.log(m);
                          setSelectedMatch(m);
                          setIsBetModalOpen(true);
                        }}
                      />
                    );
                  })}
                </div>
              )}
              {groupMatches && groupMatches.length === 0 && (
                <div className="p-4 text-gray-500 text-xs text-center">Nincsenek mérkőzések </div>
              )}
            </Panel>
            <GroupStandings
              teams={standings ?? []}
              groupName={group?.name || ""}
              groupId={groupId!}
              size="sm"
            />
          </div>
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

export default GroupDetail;
