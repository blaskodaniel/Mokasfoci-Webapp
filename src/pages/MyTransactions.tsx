import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useMyTransactions } from "@/hooks/api/usePlayers";

import type { Transaction } from "@/models/transaction.type";
import { useEffect } from "react";

const MyTransactions = () => {
  const {
    data: myTransactions,
    isLoading: myTransactionsLoading,
    error: myTransactionsError,
    refetch: refetchMyTransactions,
  } = useMyTransactions();

  useEffect(() => {
    refetchMyTransactions();
  }, [refetchMyTransactions]);

  const columns: Column<Transaction>[] = [
    {
      header: "Komment",
      key: "comment",
      render: (transaction) => (
        <span className="font-semibold">{transaction.comment}</span>
      ),
      sortable: true,
      width: "w-xl",
    },
    {
      header: "Összeg",
      key: "amount",
      render: (transaction) => (
        <span className="text-gray-400">{transaction.amount}</span>
      ),
      sortable: true,
    },
    {
      header: "Mérkőzés",
      key: "match",
      render: (transaction) => (
        <span className="text-gray-400">
          {transaction.matchid?.teamA?.name} -{" "}
          {transaction.matchid?.teamB?.name}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Dátum",
      key: "date",
      render: (transaction) => (
        <span className="text-gray-400">{transaction.date}</span>
      ),
      sortable: true,
    },
    {
      header: "Típus",
      key: "type",
      render: (transaction) => <span>{transaction.type}</span>,
      sortable: true,
      width: "w-24",
    },
  ];
  return (
    <div>
      <div className="text-white text-2xl">Tranzakcióim</div>
      <section>
        <Table
          data={myTransactions || []}
          columns={columns}
          pageSize={10}
          emptyMessage="Még nincsenek tranzakcióid."
          className="mt-4"
          loading={myTransactionsLoading}
          error={
            myTransactionsError?.message &&
            "Valami hiba történt, kérlek próbáld újra később."
          }
        />
      </section>
    </div>
  );
};

export default MyTransactions;
