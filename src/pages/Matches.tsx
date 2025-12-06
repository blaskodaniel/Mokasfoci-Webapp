import BetModalDesktop from "@/components/BetModal/Desktop";
import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useMyBets } from "@/hooks/api/usePlayers";
import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import { getMatchStatusInfo, potentialWinnings } from "@/utils/common";
import { MatchOutcome } from "@/utils/enums";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import Api from "@/services/service";
import ConfirmModal from "@/components/ConfirmModal";
import { useAllMatches } from "@/hooks/api/useMatches";
import { format } from "date-fns";

const MatchesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    data: matches,
    isLoading: matchesLoading,
    error: matchesError,
    refetch: refetchMMatches,
  } = useAllMatches();

  const onCreateCoupon = async (betAmount: number, outcome: MatchOutcome) => {
    if (!selectedMatch) return;
    try {
      setIsLoading(true);
      await Api.createBet(selectedMatch._id, betAmount, outcome);
      setSelectedMatch(null);
    } catch (error: unknown) {
      console.error("Error creating bet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchMMatches();
  }, [refetchMMatches]);

  const columns: Column<Match>[] = [
    {
      header: "Mérkőzés",
      key: "match",
      render: (match) => (
        <div className="flex flex-col">
          <span className="font-semibold">
            {match?.teamA?.name || ""} - {match.teamB?.name || ""}
          </span>
          <span className="text-xs text-gray-500">{match.type}</span>
        </div>
      ),
      sortable: true,
      width: "w-4xl",
    },
    {
      header: "Státusz",
      key: "status",
      render: (match) => (
        <span
          className={`${
            getMatchStatusInfo(match.status).color
          } px-2 py-1 rounded text-xs`}
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
      render: (match) => (
        <span className="text-gray-400">{match.oddsAwin}</span>
      ),
      sortable: true,
    },
    {
      header: "Döntetlen",
      key: "oddsDraw",
      render: (match) => (
        <span className="text-gray-400">{match.oddsDraw}</span>
      ),
      sortable: true,
    },
    {
      header: "Vendég",
      key: "oddsBwin",
      render: (match) => (
        <span className="text-gray-400">{match.oddsBwin}</span>
      ),
      sortable: true,
    },
    {
      header: "Dátum",
      key: "date",
      render: (match) => (
        <span className="text-gray-400">
          {match.date && format(new Date(match.date), "yyyy-MM-dd HH:mm")}
        </span>
      ),
      sortable: true,
    },
    {
      header: "",
      key: "actions",
      render: (match) => (
        <div
          onClick={() => setSelectedMatch(match)}
          className="px-2 py-1 rounded-md text-center bg-button-light hover:bg-button-light-hover cursor-pointer"
        >
          Fogadok
        </div>
      ),
      width: "w-24",
    },
  ];
  return (
    <div>
      <div className="text-white text-2xl">Mérkőzések</div>
      <section>
        <Table
          data={matches || []}
          columns={columns}
          pageSize={10}
          emptyMessage="Még nincsenek mérkőzések"
          className="mt-4"
          loading={matchesLoading}
          error={
            matchesError?.message &&
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
          onSave={onCreateCoupon}
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default MatchesPage;
