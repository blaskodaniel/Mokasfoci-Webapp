import BetModalDesktop from "@/components/BetModal/Desktop";
import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useMyBets } from "@/hooks/api/usePlayers";
import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import { getCouponStatusInfo, potentialWinnings } from "@/utils/common";
import { MatchOutcome } from "@/utils/enums";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import Api from "@/services/service";
import ConfirmModal from "@/components/ConfirmModal";

const MyBetsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    data: myBets,
    isLoading: myBetsLoading,
    error: myBetsError,
    refetch: refetchMyBets,
  } = useMyBets();

  const handleEditRow = (coupon: Bet) => {
    setSelectedMatch(coupon.matchid);
    setSelectedBet(coupon);
  };

  const handleDeleteRow = async (coupon: Bet) => {
    try {
      setIsLoading(true);
      await Api.deleteBet(coupon._id);
      refetchMyBets();
      setIsConfirmModalOpen(false);
      setSelectedBet(null);
    } catch (error: unknown) {
      console.error("Error deleting bet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEditCoupon = async (betAmount: number, outcome: MatchOutcome) => {
    if (!selectedBet) return;
    try {
      setIsLoading(true);
      await Api.updateBet(selectedBet._id, {
        amount: betAmount,
        outcome,
      });
      refetchMyBets();
      setSelectedMatch(null);
      setSelectedBet(null);
    } catch (error: unknown) {
      console.error("Error editing coupon:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      header: "Tét",
      key: "amount",
      render: (bet) => <span className="text-gray-400">{bet.amount}</span>,
      sortable: true,
    },
    {
      header: "Státusz",
      key: "status",
      render: (bet) => (
        <span
          className={`${
            getCouponStatusInfo(bet.status).color
          } px-2 py-1 rounded text-xs`}
        >
          {getCouponStatusInfo(bet.status).text}
        </span>
      ),
      sortable: true,
      width: "w-24",
    },
    {
      header: "Nyeremény",
      key: "custom_key",
      valueBySort: (bet) => potentialWinnings(bet.amount, bet.odds),
      render: (bet) => (
        <span className="text-gray-400">
          {potentialWinnings(bet.amount, bet.odds)}
        </span>
      ),
      sortable: true,
      width: "w-24",
    },
    {
      header: "",
      key: "actions",
      render: (coupon) => (
        <div className="flex gap-4">
          <MdEdit
            className="cursor-pointer"
            size={15}
            onClick={() => handleEditRow(coupon)}
          />
          <IoTrashOutline
            className="cursor-pointer text-red-500"
            size={15}
            onClick={() => {
              setSelectedBet(coupon);
              setIsConfirmModalOpen(true);
            }}
          />
        </div>
      ),
      sortable: false,
      width: "w-24",
      className: "justify-center",
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

      {selectedMatch && (
        <BetModalDesktop
          key={selectedMatch._id}
          match={selectedMatch}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSave={onEditCoupon}
          initBetValue={selectedBet ? selectedBet.amount : 1000}
          initSelectedOutcome={selectedBet ? selectedBet.outcome : undefined}
          editMode
          loading={isLoading}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Biztosan törölni szeretnéd a fogadást?"
        description="Ez a művelet nem visszavonható."
        onConfirm={() => {
          if (selectedBet) {
            handleDeleteRow(selectedBet);
          }
        }}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default MyBetsPage;
