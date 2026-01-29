import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useMyTransactions } from "@/hooks/api/usePlayers";
import { IoArrowBack } from "react-icons/io5";
import type { Transaction } from "@/models/transaction.type";
import { useEffect, useState } from "react";
import useResponsive from "@/hooks/useResponsive";
import MyTransactionsMobile from "@/components/MyTransactions/MobileView";
import { getTransactionTypeColors, getTransactionTypeText } from "@/utils/common";
import { TransactionType } from "@/utils/enums";

const MyTransactions = () => {
  const { isMobile } = useResponsive();
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null);

  const {
    data: myTransactions,
    isLoading: myTransactionsLoading,
    error: myTransactionsError,
    refetch: refetchMyTransactions,
  } = useMyTransactions();

  const filteredTransactions = selectedType
    ? myTransactions?.filter((x) => x.type === selectedType)
    : myTransactions;

  useEffect(() => {
    refetchMyTransactions();
  }, [refetchMyTransactions]);

  const columns: Column<Transaction>[] = [
    {
      header: "Komment",
      key: "comment",
      render: (transaction) => <span className="font-semibold">{transaction.comment}</span>,
      sortable: true,
      width: "w-xl",
    },
    {
      header: "Összeg",
      key: "amount",
      render: (transaction) => <span className="text-gray-400">{transaction.amount}</span>,
      sortable: true,
    },
    {
      header: "Mérkőzés",
      key: "match",
      render: (transaction) => (
        <span className="text-gray-400">
          {transaction.matchid?.teamA?.name} - {transaction.matchid?.teamB?.name}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Dátum",
      key: "date",
      render: (transaction) => <span className="text-gray-400">{transaction.date}</span>,
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
      <div className="flex gap-3 items-center pl-2">
        <IoArrowBack size={23} className="cursor-pointer" onClick={() => window.history.back()} />
        <div className="text-white text-2xl">Pontjaim alakulása</div>
      </div>

      {/* Horizontális scrollozható filter tag-ek */}
      <div
        className="flex gap-2 overflow-x-auto py-3 px-2 scrollbar-thin 
      scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      >
        <button
          type="button"
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap 
              focus:outline-none transition-colors bg-gray-600 text-white`}
          onClick={() => setSelectedType(null)}
        >
          mind
        </button>
        {[
          TransactionType.bet,
          TransactionType.win,
          TransactionType.penalty,
          TransactionType.reward,
          TransactionType.betModification,
        ].map((type) => (
          <button
            key={type}
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap 
              focus:outline-none transition-colors ${getTransactionTypeColors[type]}`}
            onClick={() => setSelectedType(type)}
          >
            {getTransactionTypeText(type)}
          </button>
        ))}
      </div>

      {!isMobile ? (
        <section>
          <Table
            data={filteredTransactions || []}
            columns={columns}
            pageSize={10}
            emptyMessage="Még nincsenek tranzakcióid."
            className="mt-4"
            loading={myTransactionsLoading}
            error={
              myTransactionsError?.message && "Valami hiba történt, kérlek próbáld újra később."
            }
          />
        </section>
      ) : (
        <section className="">
          <div className="max-h-[calc(100dvh-120px)] overflow-y-auto pb-4">
            {/*
              100dvh-120px: 100% viewport height minus approx. header+filter height.
              Adjust 120px as needed for your actual header+filter combined height.
            */}
            <MyTransactionsMobile data={filteredTransactions || []} />
          </div>
        </section>
      )}
    </div>
  );
};

export default MyTransactions;
