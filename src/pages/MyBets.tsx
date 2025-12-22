import BetModalDesktop from "@/components/BetModal/Desktop";
import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useMyBets, useDeleteBet, useUpdateBet } from "@/hooks/api/usePlayers";
import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import { getCouponStatusInfo, potentialWinnings } from "@/utils/common";
import { CouponStatus, MatchOutcome, MatchStatus } from "@/utils/enums";
import { useEffect, useState } from "react";
import { MdEdit, MdOutlinePriceCheck } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmModal from "@/components/ConfirmModal";
import { useNotification } from "@/hooks/useNotification";
import { Link } from "react-router-dom";

const MyBetsPage = () => {
  const { showSuccess, showError } = useNotification();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    data: myBets,
    isLoading: myBetsLoading,
    error: myBetsError,
    refetch: refetchMyBets,
  } = useMyBets();

  const deleteBetMutation = useDeleteBet();
  const updateBetMutation = useUpdateBet();

  const handleEditRow = (coupon: Bet) => {
    setSelectedMatch(coupon.matchid);
    setSelectedBet(coupon);
  };

  const handleDeleteRow = (coupon: Bet) => {
    deleteBetMutation.mutate(coupon._id, {
      onSuccess: () => {
        setIsConfirmModalOpen(false);
        setSelectedBet(null);
      },
      onError: (error) => {
        console.error("Error deleting bet:", error);
      },
    });
  };

  const onEditCoupon = async (betAmount: number, outcome: MatchOutcome) => {
    if (!selectedBet) return;
    updateBetMutation.mutate(
      {
        betId: selectedBet._id,
        data: {
          amount: betAmount,
          outcome: outcome,
        },
      },
      {
        onSuccess: () => {
          refetchMyBets();
          setSelectedMatch(null);
          setSelectedBet(null);
          setIsConfirmModalOpen(false);

          showSuccess("A fogadás sikeresen frissítve lett.");
        },
        onError: (error) => {
          console.error("Error updating bet:", error);
          showError("A fogadás frissítése sikertelen volt.");
        },
      }
    );
  };

  useEffect(() => {
    refetchMyBets();
  }, [refetchMyBets]);

  const columns: Column<Bet>[] = [
    {
      header: "Mérkőzés",
      key: "match",
      render: (bet) => {
        const canViewDetails = bet.matchid?.status !== MatchStatus.enabled;
        const matchName = `${bet.matchid?.teamA?.name || ""} - ${
          bet.matchid?.teamB?.name || ""
        }`;

        if (canViewDetails)
          return (
            <Link
              to={`/merkozesek/${bet.matchid?._id}`}
              className="font-semibold text-amber-400 hover:underline"
            >
              {matchName}
            </Link>
          );

        return <span className="font-semibold">{matchName}</span>;
      },
      sortable: true,
      width: "w-48",
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
          } px-2 py-1 rounded text-xs ${
            getCouponStatusInfo(bet.status).className
          }`}
        >
          {getCouponStatusInfo(bet.status).text}
        </span>
      ),
      sortable: true,
      width: "w-24",
    },
    {
      header: "Eredmény",
      key: "result",
      render: (bet) => (
        <span className="text-gray-400">
          {bet.status === CouponStatus.closed && bet.success === true ? (
            <div className="flex items-center gap-2 text-green-600">
              Nyert <MdOutlinePriceCheck className="text-green-600" size={20} />
            </div>
          ) : bet.status === CouponStatus.closed && bet.success === false ? (
            <span className="text-red-400">Vesztett</span>
          ) : (
            "-"
          )}
        </span>
      ),
      sortable: true,
      width: "w-24",
    },
    {
      header: "Nyeremény",
      key: "custom_key",
      valueBySort: (bet) => potentialWinnings(bet.amount, bet.odds),
      render: (bet) => {
        const shouldShowPotentialWinnings =
          bet.status === CouponStatus.active ||
          (bet.status === CouponStatus.closed && bet.success);

        return (
          <span className="text-gray-400">
            {shouldShowPotentialWinnings
              ? potentialWinnings(bet.amount, bet.odds)
              : 0}
          </span>
        );
      },
      sortable: true,
      width: "w-24",
    },
    {
      header: "Profit",
      key: "profit",
      render: (bet) => {
        if (bet.status === CouponStatus.closed && bet.success) {
          return (
            <span className="text-green-600">
              {potentialWinnings(bet.amount, bet.odds) - bet.amount}
            </span>
          );
        } else {
          return <span className="text-gray-400">0</span>;
        }
      },
      sortable: true,
      width: "w-24",
    },
    {
      header: "",
      key: "actions",
      render: (coupon) =>
        coupon.status === CouponStatus.active ? (
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
        ) : null,
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
          loading={myBetsLoading || deleteBetMutation.isPending}
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
          loading={updateBetMutation.isPending}
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
