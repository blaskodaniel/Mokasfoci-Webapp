import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import MatchDetailMobile from "@/components/Matches/MatchDetailMobile";
import useResponsive from "@/hooks/useResponsive";

import type { Bet } from "@/models/bet.type";

import { getMatchStatusInfo, outcomeText, potentialWinnings } from "@/utils/common";

import { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useMatchDetails } from "@/hooks/api/useMatches";
import Loader from "@/components/Loader";
import { APP_CONFIG } from "@/config";
import { format } from "date-fns";
import { MatchStatus } from "@/utils/enums";
import UserDisplay from "@/components/UserDisplay";

const MatchDetailPage = () => {
  const { id } = useParams();

  const {
    data: matchDetails,
    isLoading: matchDetailsLoading,
    error: matchDetailsError,
    refetch: refetchMatchDetails,
  } = useMatchDetails(id || "");

  const match = matchDetails?.match;
  const { isMobile } = useResponsive();

  useEffect(() => {
    refetchMatchDetails();
  }, [refetchMatchDetails]);

  const matchStyle = getMatchStatusInfo(match?.status || MatchStatus.enabled);

  const renderMatchStatusOrDate = () => {
    if (match?.status === MatchStatus.playing) {
      return (
        <span className={`${matchStyle.className} ${matchStyle.color} px-2 py-1 rounded text-xs`}>
          {matchStyle.text}
        </span>
      );
    }

    if (match?.status === MatchStatus.finished) {
      return <span className="text-white font-bold">Vége</span>;
    }

    if (match?.date) {
      return format(new Date(match.date), "LLL dd HH:mm");
    }

    return null;
  };

  const columns: Column<Bet>[] = [
    {
      header: "Játékos",
      key: "user",
      render: (bet) => <UserDisplay user={bet.userid!} showAvatar={true} avatarSize="sm" />,
      sortable: true,
      // width: "w-48",
    },
    {
      header: "Tipp",
      key: "team",
      render: (bet) => <span className="text-gray-400">{match && outcomeText(bet, match)}</span>,
      sortable: true,
    },
    {
      header: "Tét",
      key: "amount",
      render: (bet) => <span className="text-gray-400">{bet.amount}</span>,
      sortable: true,
    },
    {
      header: "Odds",
      key: "odds",
      render: (bet) => <span className="text-gray-400">{bet.odds}</span>,
      sortable: true,
    },
    {
      header: "Státusz",
      key: "success",
      render: (bet) => {
        const isFinished = match?.status === MatchStatus.finished;
        if (!isFinished) return null;
        return (
          <span
            className={`${
              bet.success ? "text-green-400" : "text-red-400"
            } px-2 py-1 rounded text-xs `}
          >
            {bet.success ? "Nyert" : "Vesztett"}
          </span>
        );
      },
      sortable: true,
    },
    {
      header: "Nyeremény",
      key: "custom_key",
      valueBySort: (bet) => potentialWinnings(bet.amount, bet.odds),
      render: (bet) => {
        const isFinished = match?.status === MatchStatus.finished;

        if (!isFinished) {
          return <span className="text-gray-400">{potentialWinnings(bet.amount, bet.odds)}</span>;
        }

        return (
          <span className="text-gray-400">
            {bet.success ? potentialWinnings(bet.amount, bet.odds) : 0}
          </span>
        );
      },
      sortable: true,
      width: "w-24",
    },
  ];

  // Loading screen amikor a match details töltődik
  if (matchDetailsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader text="Mérkőzés adatok betöltése..." />
      </div>
    );
  }

  // Error screen - csak akkor jelenítjük meg, ha valóban van hiba
  if (matchDetailsError && !matchDetailsLoading) {
    return (
      <div className="text-center text-white py-8">
        <div className="text-red-400 mb-4">Hiba történt a mérkőzés adatok betöltése során</div>
        <button
          onClick={() => {
            // Reset error state és újrapróbálás
            refetchMatchDetails();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Újrapróbálás
        </button>
      </div>
    );
  }

  if (!match) return <div>Nem található mérkőzés</div>;

  return (
    <div>
      <div className="flex mx-auto items-center gap-8 justify-center mb-6">
        <div className="flex flex-col justify-center items-center gap-4">
          {match?.teamA?.flag && (
            <img
              src={`${APP_CONFIG.FLAG_PATH}${match.teamA.flag}`}
              alt={`${match.teamA.name} flag`}
              className="w-16 h-16 object-cover rounded-full"
            />
          )}
        </div>
        {match?.status === MatchStatus.finished && (
          <div className="font-extrabold text-2xl">{match.goalA}</div>
        )}
        <div className="justify-center items-center flex flex-col gap-2">
          <div className="flex justify-center items-center text-xs text-gray-400">
            {renderMatchStatusOrDate()}
          </div>
          <div className="text-xl text-white">vs</div>
        </div>
        {match?.status === MatchStatus.finished && (
          <div className="font-extrabold text-2xl">{match.goalB}</div>
        )}
        <div className="flex flex-col justify-center items-center gap-4">
          {match?.teamB?.flag && (
            <img
              src={`${APP_CONFIG.FLAG_PATH}${match?.teamB.flag}`}
              alt={`${match?.teamB.name} flag`}
              className="w-16 h-16 object-cover rounded-full"
            />
          )}
        </div>
      </div>
      <div className="flex gap-3 justify-center mb-6">
        <div className="text-sm flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-1">1</span>
          <span className="bg-gray-700/20 py-1 px-2 rounded-2xl font-bold">{match?.oddsAwin}</span>
        </div>
        <div className="text-sm flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-1">X</span>
          <span className="bg-gray-700/20 py-1 px-2 rounded-2xl font-bold">{match?.oddsDraw}</span>
        </div>
        <div className="text-sm flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-1">2</span>
          <span className="bg-gray-700/20 py-1 px-2 rounded-2xl font-bold">{match?.oddsBwin}</span>
        </div>
      </div>

      <section>
        {isMobile ? (
          <MatchDetailMobile bets={matchDetails?.coupons || []} match={match} />
        ) : (
          <Table
            data={matchDetails?.coupons || []}
            columns={columns}
            pageSize={10}
            emptyMessage="Még nincsenek fogadások"
            className="mt-4"
            loading={matchDetailsLoading}
          />
        )}
      </section>
    </div>
  );
};

export default MatchDetailPage;
