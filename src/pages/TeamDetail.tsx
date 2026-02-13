import BetModalDesktop from "@/components/BetModal/Desktop";
import type { MatchWithUserBet } from "@/components/Matches/types";
import MatchListItem from "@/components/MatchListItem";
import MobileBackBar from "@/components/MobileBackBar";
import PageLoader from "@/components/PageLoader";
import Panel from "@/components/Panel";
import GroupStandings from "@/components/Widgets/GroupStandings";
import { APP_CONFIG } from "@/config";
import { useMyBets } from "@/hooks/api/usePlayers";
import { useGetGroupStandingsById, useTeamDetails } from "@/hooks/api/useTeams";
import { useBetting } from "@/hooks/useBetting";
import { MatchOutcome, MatchStatus } from "@/utils/enums";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const TeamDetail = () => {
  const teamId = useParams()?.id;
  const { data: details, isLoading } = useTeamDetails(teamId!);
  const teamStandingsQuery = useGetGroupStandingsById(String(details?.teamData?.groupid._id ?? ""));
  const { data: myBets } = useMyBets();
  const { onSubmitCoupon: submitBet, isPending: isBettingPending } = useBetting();

  const teamData = useMemo(() => details?.teamData, [details?.teamData]);
  const favoriteUsers = useMemo(() => details?.favoriteUsers || [], [details?.favoriteUsers]);
  const championUsers = useMemo(() => details?.championUsers || [], [details?.championUsers]);
  const groupWinners = useMemo(() => details?.groupWinners || [], [details?.groupWinners]);
  const matches = useMemo(() => details?.matches || [], [details?.matches]);

  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUserBet | null>(null);

  const matchesWithBets = useMemo((): MatchWithUserBet[] => {
    if (!matches || !myBets) return matches || [];

    const combined = matches.map((match) => {
      const userBet = myBets.find((bet) => bet.matchid._id === match._id);

      return {
        ...match,
        userbet: userBet,
      };
    });

    return combined;
  }, [matches, myBets]);

  const onSubmitCoupon = (betAmount: number, outcome: MatchOutcome) => {
    if (!selectedMatch) return;

    submitBet(selectedMatch, betAmount, outcome, () => setIsBetModalOpen(false));
  };

  if (isLoading) {
    return <PageLoader message="Adatok betöltése..." />;
  }

  return (
    <div>
      <MobileBackBar title="Csapat részletei" />
      {/* Avatar */}
      <div className="px-1">
        <div className="pl-2 flex justify-start mb-3 gap-4 items-center">
          <div
            className="w-15 h-15 rounded-full bg-linear-to-br flex 
                      items-center justify-center text-white text-4xl font-bold cursor-pointer 
                      hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            <img
              src={`${APP_CONFIG.FLAG_PATH}${teamData?.flag}`}
              alt={`Flag of ${teamData?.name}`}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                // Ha a kép betöltése sikertelen, fallback karakter
                e.currentTarget.style.display = "none";
                const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallbackDiv) {
                  fallbackDiv.style.display = "flex";
                }
              }}
            />
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{ display: "none" }}
            >
              {teamData?.name?.charAt(0).toUpperCase() || "CS"}
            </div>
          </div>
          <div>
            <div className="text-left text-xl font-semibold">{teamData?.name}</div>
            <div className="text-gray-500">{teamData?.groupid?.name} csoport</div>
            <div className="text-gray-500 text-xs">{teamData?.tla}</div>
          </div>
        </div>

        {/* Widgets */}
        <div className="flex flex-col gap-4 sm:px-4 mb-3 px-1">
          <Panel className="flex-1" noBackground>
            <div className="px-0 gap-4 md:gap-6 lg:gap-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
              <div className="bg-gray-900/50 backdrop-blur-sm p-3 border border-gray-700/50 px-4 py-3 rounded-2xl text-white">
                <div>Kedvenc csapat</div>
                <div className="flex flex-col justify-start">
                  <span className="font-bold text-xl">{favoriteUsers.length}</span>
                  <span className="text-xs text-gray-500">felhasználó</span>
                </div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm p-3 border border-gray-700/50 px-4 py-3 rounded-2xl text-white">
                <div>Bajnok jelölések</div>
                <div className="flex flex-col justify-start">
                  <span className="font-bold text-xl">{championUsers.length}</span>
                  <span className="text-xs text-gray-500">felhasználó</span>
                </div>
              </div>
              <div
                className="bg-gray-900/50 backdrop-blur-sm p-3 border border-gray-700/50 px-4 py-3 rounded-2xl text-white 
              col-span-2 md:col-span-1 lg:col-span-1"
              >
                <div>Csoportgyőztes jelölések</div>
                <div className="flex flex-col justify-start">
                  <span className="font-bold text-xl">{groupWinners.length}</span>
                  <span className="text-xs text-gray-500">felhasználó</span>
                </div>
              </div>
            </div>
          </Panel>
          <div className="flex gap-3 flex-col sm:flex-row">
            <Panel title={`${teamData?.name} mérkőzései`} className="flex-1">
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
              {matches && matches.length === 0 && (
                <div className="p-4 text-gray-500 text-xs text-center">Nincsenek mérkőzések </div>
              )}
            </Panel>
            <GroupStandings
              teams={teamStandingsQuery.data ?? []}
              groupName={teamData?.groupid?.name || ""}
              size="sm"
            />
          </div>
        </div>
      </div>

      {selectedMatch && (
        <BetModalDesktop
          key={selectedMatch._id}
          match={selectedMatch}
          isOpen={isBetModalOpen}
          onClose={() => setIsBetModalOpen(false)}
          onAfterClose={() => setSelectedMatch(null)}
          onSave={onSubmitCoupon}
          loading={isBettingPending}
          editMode={!!selectedMatch.userbet}
          initBetValue={selectedMatch.userbet?.amount}
          initSelectedOutcome={selectedMatch.userbet?.outcome}
        />
      )}
    </div>
  );
};

export default TeamDetail;
