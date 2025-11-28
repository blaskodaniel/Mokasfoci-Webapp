import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useMyBets } from "@/hooks/api/usePlayers";
import type { Bet } from "@/models/bet.type";
import { getStatusInfo } from "@/utils/common";
import { MatchOutcome } from "@/utils/enums";
import { useEffect } from "react";

const MyBetsPage = () => {
  const {
    data: myBets,
    isLoading: myBetsLoading,
    error: myBetsError,
    refetch: refetchMyBets,
  } = useMyBets();

  useEffect(() => {
    refetchMyBets();
  }, [refetchMyBets]);

  const columns: Column<Bet>[] = [
    {
      header: "Mérkőzés",
      key: "match",
      render: (bet) => (
        <span className="font-semibold">
          {bet?.matchid?.teamA?.name || ""} - {bet.matchid?.teamB?.name || ""}
        </span>
      ),
      sortable: true,
      // width: "w-48",
    },
    {
      header: "Kimenetel",
      key: "outcome",
      render: (bet) => (
        <span className="text-gray-400">
          {bet.outcome === MatchOutcome.home
            ? bet?.matchid?.teamA?.name
            : bet.outcome === MatchOutcome.away
            ? bet?.matchid?.teamB?.name
            : "Döntetlen"}
        </span>
      ),
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
      key: "status",
      render: (bet) => (
        <span
          className={`${
            getStatusInfo(bet.status).color
          } px-2 py-1 rounded text-xs`}
        >
          {getStatusInfo(bet.status).text}
        </span>
      ),
      sortable: true,
      width: "w-24",
    },
  ];
  return (
    <div>
      <div className="text-white text-2xl">Összess fogadásom</div>
      <section>
        <Table
          data={myBets || []}
          columns={columns}
          pageSize={10}
          emptyMessage="Még nincsenek fogadásaid"
          className="mt-4"
          loading={myBetsLoading}
          error={
            myBetsError?.message &&
            "Valami hiba történt, kérlek próbáld újra később."
          }
        />
      </section>
    </div>
  );
};

export default MyBetsPage;
