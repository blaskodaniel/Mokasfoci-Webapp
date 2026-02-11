import BetModalDesktop from "@/components/BetModal/Desktop";
import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useMyBets, useDeleteBet, useUpdateBet, playersKeys } from "@/hooks/api/usePlayers";
import type { Bet } from "@/models/bet.type";
import type { Match } from "@/models/match.type";
import { formatNumber, getCouponStatusInfo, potentialWinnings } from "@/utils/common";
import { CouponStatus, MatchOutcome, MatchStatus } from "@/utils/enums";
import { useEffect, useMemo, useState } from "react";
import { MdEdit, MdFavorite, MdOutlinePriceCheck } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmModal from "@/components/ConfirmModal";
import { useNotification } from "@/hooks/useNotification";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import useResponsive from "@/hooks/useResponsive";
import MyBetsMobileView from "@/components/MyBets/MobileView";
import { useConfig } from "@/hooks/useConfig";
import useGame from "@/hooks/useGame";
import { useQueryClient } from "@tanstack/react-query";

const MyBetsPage = () => {
  const queryClient = useQueryClient();
  const { config } = useConfig();
  const { userFavoriteTeam } = useGame();
  const { isDesktop, isMobile } = useResponsive();
  const { showSuccess, showError } = useNotification();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const {
    data: myBets,
    isLoading: myBetsLoading,
    error: myBetsError,
    refetch: refetchMyBets,
  } = useMyBets();

  const deleteBetMutation = useDeleteBet();
  const updateBetMutation = useUpdateBet();

  const filteredCoupon = useMemo(() => {
    if (selectedStatus === "win")
      return myBets?.filter((x) => x.success && x.status === CouponStatus.closed);
    if (selectedStatus === "lost")
      return myBets?.filter((x) => !x.success && x.status === CouponStatus.closed);
    return selectedStatus ? myBets?.filter((x) => x.status === selectedStatus) : myBets;
  }, [myBets, selectedStatus]);

  const handleEditRow = (coupon: Bet) => {
    setSelectedMatch(coupon.matchid);
    setSelectedBet(coupon);
    setIsBetModalOpen(true);
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
          setIsBetModalOpen(false);
          setIsConfirmModalOpen(false);
          queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
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

  // Szinkronizáljuk a selectedMatch-et a frissült adatokkal amikor változnak az odds-ok
  useEffect(() => {
    if (selectedMatch && isBetModalOpen) {
      const updatedBet = myBets?.find((bet) => bet.matchid._id === selectedMatch._id);
      if (updatedBet) {
        setSelectedMatch(updatedBet.matchid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myBets, isBetModalOpen, selectedMatch?._id]);

  const columns: Column<Bet>[] = [
    {
      header: "Mérkőzés",
      key: "match",
      render: (bet) => {
        const canViewDetails = bet.matchid?.status !== MatchStatus.enabled;
        const matchName = `${bet.matchid?.teamA?.name || ""} - ${bet.matchid?.teamB?.name || ""}`;

        if (canViewDetails)
          return (
            <Link
              to={`/merkozesek/${bet.matchid?._id}`}
              className="font-semibold text-amber-400 hover:underline"
            >
              <div className="flex gap-1">
                {matchName}
                {userFavoriteTeam(bet.matchid) && <MdFavorite color="red" />}
              </div>
            </Link>
          );

        return (
          <span className="font-semibold">
            <div className="flex gap-1">
              {matchName}
              {userFavoriteTeam(bet.matchid) && <MdFavorite color="red" />}
            </div>
          </span>
        );
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
      render: (bet) => {
        if (userFavoriteTeam(bet.matchid)) {
          return (
            <div className="text-gray-400">
              {bet.odds} <span className="text-green-600">* {config?.favoritTeamFactor}x</span>
            </div>
          );
        }
        return <span className="text-gray-400">{bet.odds}</span>;
      },
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
          className={`${getCouponStatusInfo(bet.status).color} px-2 py-1 rounded text-xs ${
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
      key: "totalWin",
      valueBySort: (bet) => bet.totalWin,
      render: (bet) => {
        const hasFavoriteTeam = userFavoriteTeam(bet.matchid);
        const favoritTeamFactor = hasFavoriteTeam ? config?.favoritTeamFactor : 1;
        const shouldShowPotentialWinnings =
          bet.status === CouponStatus.active || (bet.status === CouponStatus.closed && bet.success);
        const winnings =
          bet.status === CouponStatus.active
            ? potentialWinnings(bet.amount, bet.odds, favoritTeamFactor)
            : bet.totalWin;
        return (
          <span className="text-gray-400">
            {shouldShowPotentialWinnings ? formatNumber(winnings) : 0}
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
          return <span className="text-green-600">{bet.totalWin - bet.amount}</span>;
        } else {
          return <span className="text-gray-400">0</span>;
        }
      },
      sortable: true,
      width: "w-24",
    },
    {
      header: "Létrehozva",
      key: "date",
      render: (bet) => (
        <span className="text-gray-400 text-xs">
          {bet.date && format(new Date(bet.date), "MMM dd HH:mm")}
        </span>
      ),
      sortable: true,
      width: "w-32",
    },
    {
      header: "",
      key: "actions",
      render: (coupon) =>
        coupon.status === CouponStatus.active ? (
          <div className="flex gap-4">
            <MdEdit className="cursor-pointer" size={15} onClick={() => handleEditRow(coupon)} />
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
    <div className="px-2">
      <div className="text-white text-center sm:text-left text-xl sm:text-2xl">Fogadásaim</div>

      {/* Horizontális scrollozható filter tag-ek */}
      <div
        className="flex gap-2 overflow-x-auto py-3 px-2 scrollbar-thin 
            scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      >
        <button
          type="button"
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap 
                    focus:outline-none transition-colors 
                    text-white ${selectedStatus === null ? "bg-gray-700" : "bg-gray-500"}`}
          onClick={() => setSelectedStatus(null)}
        >
          Mind
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap 
                    focus:outline-none transition-colors 
                    text-white ${selectedStatus === "win" ? "bg-green-900" : "bg-gray-500"}`}
          onClick={() => setSelectedStatus("win")}
        >
          Nyertes
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap 
                    focus:outline-none transition-colors 
                    text-white ${selectedStatus === "lost" ? "bg-red-900" : "bg-gray-500"}`}
          onClick={() => setSelectedStatus("lost")}
        >
          Vesztes
        </button>
        {[CouponStatus.active, CouponStatus.closed].map((type) => (
          <button
            key={type}
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap 
                    focus:outline-none transition-colors
                    ${selectedStatus === type ? getCouponStatusInfo(type).selectedColor : "bg-gray-700"}`}
            onClick={() => setSelectedStatus(type)}
          >
            {getCouponStatusInfo(type).text}
          </button>
        ))}
      </div>

      {isDesktop && (
        <section>
          <Table
            data={filteredCoupon || []}
            columns={columns}
            pageSize={10}
            emptyMessage="Még nincsenek fogadásaid"
            className="mt-4"
            loading={myBetsLoading || deleteBetMutation.isPending}
            error={myBetsError?.message && "Valami hiba történt, kérlek próbáld újra később."}
          />
        </section>
      )}
      {isMobile && (
        <section className="pb-3 pt-2">
          <MyBetsMobileView
            bets={filteredCoupon || []}
            onEdit={handleEditRow}
            onDelete={(bet: Bet) => {
              setSelectedBet(bet);
              setIsConfirmModalOpen(true);
            }}
          />
        </section>
      )}

      {selectedMatch && (
        <BetModalDesktop
          key={selectedMatch._id}
          match={selectedMatch}
          isOpen={isBetModalOpen}
          onClose={() => setIsBetModalOpen(false)}
          onAfterClose={() => {
            setSelectedMatch(null);
            setSelectedBet(null);
          }}
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
