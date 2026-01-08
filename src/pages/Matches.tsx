import BetModalDesktop from "@/components/BetModal/Desktop";
import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useMyBets, useUpdateBet, useCreateBet } from "@/hooks/api/usePlayers";
import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import {
  getMatchStatusInfo,
  getMatchTypeText,
  outcomeText,
  potentialWinnings,
} from "@/utils/common";
import { MatchOutcome, MatchStatus } from "@/utils/enums";
import { useEffect, useState, useMemo } from "react";
import { useAllMatches } from "@/hooks/api/useMatches";
import { format } from "date-fns";
import { useAppSelector } from "@/state/hooks";
import { useNotification } from "@/hooks/useNotification";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import Calendar from "@/components/Calendar";

// Extended Match type a user bet-tel
type MatchWithUserBet = Match & {
  userbet?: Bet;
};

const MatchesPage = () => {
  const { showSuccess, showError } = useNotification();
  const { currentUser } = useAppSelector((state) => state.auth);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUserBet | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const {
    data: matches,
    isLoading: matchesLoading,
    error: matchesError,
    refetch: refetchMatches,
  } = useAllMatches();

  const {
    data: myBets,
    isLoading: myBetsLoading,
    error: myBetsError,
    refetch: refetchMyBets,
  } = useMyBets();

  const updateBetMutation = useUpdateBet();
  const createBetMutation = useCreateBet();

  // Matches és myBets összevonása
  const matchesWithBets = useMemo((): MatchWithUserBet[] => {
    if (!matches || !myBets) return matches || [];

    return matches.map((match) => {
      // Megkeressük a user bet-et ehhez a match-hez
      const userBet = myBets.find((bet) => bet.matchid._id === match._id);

      return {
        ...match,
        userbet: userBet,
      };
    });
  }, [matches, myBets]);

  const onSubmitCoupon = (betAmount: number, outcome: MatchOutcome, editMode: boolean) => {
    if (!selectedMatch) return;

    if (editMode && selectedMatch.userbet) {
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
            setSelectedMatch(null);
            showSuccess("A fogadás sikeresen frissítve lett.");
          },
          onError: (error) => {
            console.error("Error updating bet:", error);
            showError("A fogadás frissítése sikertelen volt.");
          },
        }
      );
    } else {
      createBetMutation.mutate(
        {
          matchId: selectedMatch._id,
          betAmount,
          outcome,
        },
        {
          onSuccess: () => {
            setSelectedMatch(null);
            showSuccess("A fogadás sikeresen létrehozva lett.");
          },
          onError: (error) => {
            if (error instanceof AxiosError && error.status === 400) {
              if (error.response?.data.msg === "Don't have enough score to bet") {
                showError("Nincs elég pontod a fogadás létrehozásához.");
                return;
              } else if (error.response?.data.msg === "The match has already started") {
                showError("A mérkőzés már elkezdődött, nem lehet fogadni rá.");
                return;
              }
            }
            console.error("Error creating bet:", error);
            showError("A fogadás létrehozása sikertelen volt.");
          },
        }
      );
    }
  };

  useEffect(() => {
    refetchMatches();
    refetchMyBets();
  }, [refetchMatches, refetchMyBets]);

  const columns: Column<MatchWithUserBet>[] = [
    {
      header: "Mérkőzés",
      key: "match",
      render: (match) => {
        const matchName = `${match.teamA?.name || ""} - ${match.teamB?.name || ""}`;
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
      render: (match) => <span className="text-gray-400">{match.oddsAwin}</span>,
      sortable: true,
      width: "w-24",
    },
    {
      header: "Döntetlen",
      key: "oddsDraw",
      render: (match) => <span className="text-gray-400">{match.oddsDraw}</span>,
      sortable: true,
      width: "w-24",
    },
    {
      header: "Vendég",
      key: "oddsBwin",
      render: (match) => <span className="text-gray-400">{match.oddsBwin}</span>,
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

        const bet = match.userbet;

        return (
          <div className="flex flex-col">
            <span className="text-xs text-blue-400">{outcomeText(bet, match)}</span>
            <span className="text-xs text-gray-400">Tét: {bet.amount} pont</span>
            {match.status === MatchStatus.finished && bet.success && (
              <span className="text-xs text-green-400">
                Nyeremény:{potentialWinnings(bet.amount, bet.odds)} pont
              </span>
            )}
            {match.status === MatchStatus.finished && !bet.success && (
              <span className="text-xs text-red-400">Vesztett</span>
            )}
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

        // Ha van fogadás és a mérkőzés aktív
        if (hasUserBet && isMatchEnabled) {
          return (
            <div
              onClick={() => setSelectedMatch(match)}
              className="px-2 py-1 rounded-md text-center text-xs bg-button-secondary-bg hover:bg-button-secondary-bg-hover cursor-pointer"
            >
              Fogadás módosítása
            </div>
          );
        }

        // Ha nincs fogadás, van elég pont és a mérkőzés aktív
        if (!hasUserBet && hasEnoughScore && isMatchEnabled) {
          return (
            <div
              onClick={() => setSelectedMatch(match)}
              className="px-2 py-1 rounded-md text-center bg-button-light hover:bg-button-light-hover cursor-pointer text-xs"
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
      <div className="text-white text-center sm:text-left text-2xl pb-2">Mérkőzések</div>
      <Calendar onDateSelect={(date) => setSelectedDate(date)} selectedDate={selectedDate} />
      <section>
        <Table
          data={matchesWithBets}
          columns={columns}
          pageSize={10}
          emptyMessage="Még nincsenek mérkőzések"
          className="mt-4"
          loading={
            matchesLoading ||
            myBetsLoading ||
            updateBetMutation.isPending ||
            createBetMutation.isPending
          }
          error={
            (matchesError?.message || myBetsError?.message) &&
            "Valami hiba történt, kérlek próbáld újra később."
          }
        />
      </section>

      {selectedMatch && (
        <BetModalDesktop
          key={selectedMatch._id}
          match={selectedMatch}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSave={onSubmitCoupon}
          loading={updateBetMutation.isPending || createBetMutation.isPending}
          editMode={!!selectedMatch.userbet}
          initBetValue={selectedMatch.userbet?.amount}
          initSelectedOutcome={selectedMatch.userbet?.outcome}
        />
      )}
    </div>
  );
};

export default MatchesPage;
