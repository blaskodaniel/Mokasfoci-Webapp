import type { Column } from "@/components/Table/types";
import { useMyBets } from "@/hooks/api/usePlayers";
import { getMatchStatusInfo, getMatchTypeText, outcomeText } from "@/utils/common";
import { CouponType, MatchStatus } from "@/utils/enums";
import { useEffect, useState, useMemo } from "react";
import { isBettableMatch, useAllMatches } from "@/hooks/api/useMatches";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Calendar from "@/components/Calendar";
import useResponsive from "@/hooks/useResponsive";
import MatchesDesktopView from "@/components/Matches/DesktopView.tsx";
import MatchesMobileView from "@/components/Matches/MobileView";
import type { MatchWithUserBet } from "@/components/Matches/types";
import BetModal from "@/components/BetModal";
import { useAuth } from "@/hooks/useAuth";

const MatchesPage = () => {
  const { isDesktop } = useResponsive();
  const { user: currentUser } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUserBet | null>(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const {
    data: matches,
    isLoading: matchesLoading,
    error: matchesError,
    refetch: refetchMatches,
  } = useAllMatches({
    sortBy: "date",
    sortOrder: "asc",
    startDate: selectedDate,
    endDate: selectedDate,
  });

  const {
    data: myBets,
    isLoading: myBetsLoading,
    error: myBetsError,
    refetch: refetchMyBets,
  } = useMyBets();

  // Matches és myBets összevonása
  const matchesWithBets = useMemo((): MatchWithUserBet[] => {
    if (!matches || !myBets) return matches || [];

    const combined = matches.map((match) => {
      // Megkeressük a user fogadásokat ehhez a match-hez
      const userBet = myBets.filter((bet) => bet.matchid._id === match._id);

      return {
        ...match,
        userbet: userBet,
      };
    });

    // Rendezés státusz szerint: playing -> enabled -> többi
    return combined.sort((a, b) => {
      if (a.status === MatchStatus.playing && b.status !== MatchStatus.playing) {
        return -1;
      }
      if (a.status !== MatchStatus.playing && b.status === MatchStatus.playing) {
        return 1;
      }
      if (a.status === MatchStatus.enabled && b.status !== MatchStatus.enabled) {
        return -1;
      }
      if (a.status !== MatchStatus.enabled && b.status === MatchStatus.enabled) {
        return 1;
      }
      return 0;
    });
  }, [matches, myBets]);

  // Szinkronizáljuk a selectedMatch-et a frissült adatokkal amikor változnak az odds-ok
  useEffect(() => {
    if (selectedMatch && isBetModalOpen) {
      const updatedMatch = matchesWithBets.find((m) => m._id === selectedMatch._id);
      if (updatedMatch) {
        setSelectedMatch(updatedMatch);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchesWithBets, isBetModalOpen, selectedMatch?._id]);

  useEffect(() => {
    refetchMatches();
    refetchMyBets();
  }, [refetchMatches, refetchMyBets]);

  const columns: Column<MatchWithUserBet>[] = [
    {
      header: "Mérkőzés",
      key: "match",
      render: (match) => {
        const matchName = `${match.teamA?.name || match.teamAPlaceholder || ""} - ${match.teamB?.name || match.teamBPlaceholder || ""}`;
        const canViewDetails = match.status !== MatchStatus.enabled;

        return (
          <div className="flex flex-col">
            {canViewDetails ? (
              <Link
                to={`/merkozesek/${match._id}`}
                className="font-semibold text-amber-400 hover:underline"
              >
                {matchName}
              </Link>
            ) : (
              <span className="font-semibold text-white">{matchName}</span>
            )}
            <span className="text-xs text-gray-500 mt-1">{getMatchTypeText(match.type)}</span>
          </div>
        );
      },
      sortable: false,
      width: "w-4xl",
    },
    {
      header: "Eredmény",
      key: "result",
      render: (match) => (
        <div className="flex flex-col items-center">
          <div className="text-sm text-white">
            {match.status === MatchStatus.finished ? `${match.goalA} - ${match.goalB}` : ""}
          </div>
        </div>
      ),
      sortable: false,
      width: "w-24",
    },
    {
      header: "Státusz",
      key: "status",
      render: (match) => (
        <span
          className={`${getMatchStatusInfo(match.status).color} px-2 py-1 rounded text-xs ${
            getMatchStatusInfo(match.status).className
          }`}
        >
          {getMatchStatusInfo(match.status).text}
        </span>
      ),
      sortable: true,
      width: "w-24",
    },

    {
      header: "Hazai",
      key: "oddsAwin",
      render: (match) => <span className="text-gray-400">{match.oddsAwin?.toFixed(2) || "-"}</span>,
      sortable: true,
      width: "w-24",
    },
    {
      header: "Döntetlen",
      key: "oddsDraw",
      render: (match) => <span className="text-gray-400">{match.oddsDraw?.toFixed(2) || "-"}</span>,
      sortable: true,
      width: "w-24",
    },
    {
      header: "Vendég",
      key: "oddsBwin",
      render: (match) => <span className="text-gray-400">{match.oddsBwin?.toFixed(2) || "-"}</span>,
      sortable: true,
      width: "w-24",
    },
    {
      header: "Saját fogadás",
      key: "userbet",
      render: (match) => {
        if (!match.userbet) {
          return <span className="text-gray-500 text-xs">-</span>;
        }

        const bets = match.userbet;

        return (
          <div className="flex flex-col">
            {bets.map((betItem) => (
              <div key={betItem._id} className="flex flex-row gap-3">
                {betItem.type === CouponType.outcomeBet && (
                  <span className="text-xs text-blue-400">{outcomeText(betItem, match)}</span>
                )}
                {betItem.type === CouponType.scoreBet && (
                  <span className="text-xs text-blue-400">
                    {betItem.scoreTeamA} - {betItem.scoreTeamB}
                  </span>
                )}
                <span className="text-xs text-gray-400">Tét: {betItem.amount} pont</span>
                {/* {match.status === MatchStatus.finished &&
                  betItem.success &&
                  betItem.type === CouponType.outcomeBet && (
                    <span className="text-xs text-green-400">
                      Nyeremény:{potentialWinnings(betItem.amount, betItem.odds)} pont
                    </span>
                  )} */}
                {/* {match.status === MatchStatus.finished && !betItem.success && (
                  <span className="text-xs text-red-400">Vesztett</span>
                )} */}
              </div>
            ))}
          </div>
        );
      },
      sortable: false,
      width: "w-4xl",
    },
    {
      header: "Dátum",
      key: "date",
      render: (match) => (
        <span className="text-gray-400 text-xs">
          {match.date && format(new Date(match.date), "MMM dd HH:mm")}
        </span>
      ),
      sortable: true,
      width: "w-32",
    },
    {
      header: "",
      key: "actions",
      render: (match) => {
        const hasUserBet = !!match.userbet;
        const isMatchEnabled = match.status === MatchStatus.enabled;
        const hasEnoughScore = currentUser && currentUser.data.availableScore > 99;

        if (!match?.teamA || !match?.teamB || !match?.date) {
          return;
        }

        // Ha van fogadás és a mérkőzés aktív
        if (hasUserBet && isMatchEnabled) {
          return (
            <div
              onClick={() => {
                setSelectedMatch(match);
                setIsBetModalOpen(true);
              }}
              className="px-2 py-1 rounded-md text-center text-xs bg-button-secondary-bg hover:bg-button-secondary-bg-hover cursor-pointer"
            >
              Fogadás módosítása
            </div>
          );
        }

        // Ha nincs fogadás, van elég pont és a mérkőzés aktív
        if (!hasUserBet && hasEnoughScore && isBettableMatch(match)) {
          return (
            <div
              onClick={() => {
                setSelectedMatch(match);
                setIsBetModalOpen(true);
              }}
              className="px-2 py-1 rounded-md text-center bg-button-light
               hover:bg-button-light-hover cursor-pointer text-xs"
            >
              Fogadok a mérkőzésre
            </div>
          );
        }

        // Minden más esetben üres
        return null;
      },
      width: "w-24",
    },
  ];
  return (
    <div>
      <div className="text-white text-center sm:text-left text-xl sm:text-2xl pb-2">Mérkőzések</div>
      <Calendar onDateSelect={(date) => setSelectedDate(date)} selectedDate={selectedDate} />
      {isDesktop && (
        <section>
          <MatchesDesktopView
            matchesWithBets={matchesWithBets}
            columns={columns}
            error={
              (matchesError?.message || myBetsError?.message) &&
              "Valami hiba történt, kérlek próbáld újra később."
            }
            loading={matchesLoading || myBetsLoading}
          />
        </section>
      )}

      {!isDesktop && (
        <section>
          <MatchesMobileView
            matchesWithBets={matchesWithBets}
            error={
              (matchesError?.message || myBetsError?.message) &&
              "Valami hiba történt, kérlek próbáld újra később."
            }
            loading={matchesLoading || myBetsLoading}
            onSelectMatch={(match) => {
              setSelectedMatch(match);
              setIsBetModalOpen(true);
            }}
          />
        </section>
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

export default MatchesPage;
