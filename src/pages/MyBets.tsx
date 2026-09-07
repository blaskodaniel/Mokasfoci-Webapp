import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useMyBets, useDeleteBet, playersKeys } from "@/hooks/api/usePlayers";
import type { Bet } from "@/models/bet.type";
import type { MatchWithUserBet } from "@/components/Matches/types";
import { formatNumber, getCouponStatusInfo, potentialWinnings } from "@/utils/common";
import { CouponStatus, CouponType, MatchOutcome, MatchStatus } from "@/utils/enums";
import { useEffect, useMemo, useState } from "react";
import { MdEdit, MdOutlinePriceCheck } from "react-icons/md";
import { IoTrashOutline, IoTicketOutline, IoStar } from "react-icons/io5";
import ConfirmModal from "@/components/ConfirmModal";
import { Link } from "react-router-dom";
import useResponsive from "@/hooks/useResponsive";
import MyBetsMobileView from "@/components/MyBets/MobileView";
import { useConfig } from "@/hooks/useConfig";
import useGame from "@/hooks/useGame";
import { useQueryClient } from "@tanstack/react-query";
import BetModal from "@/components/BetModal";
import { AxiosError } from "axios";
import { APP_CONFIG } from "@/config";

const MyBetsPage = () => {
  const queryClient = useQueryClient();
  const { config } = useConfig();
  const { userFavoriteTeam } = useGame();
  const { isMobile, isTablet } = useResponsive();
  const showCardView = isMobile || isTablet;
  const [selectedMatch, setSelectedMatch] = useState<MatchWithUserBet | null>(null);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: myBets, isLoading: myBetsLoading, error: myBetsError } = useMyBets();

  const deleteBetMutation = useDeleteBet();

  const filteredCoupon = useMemo(() => {
    let filtered = myBets;

    if (selectedStatus === "win") {
      filtered = myBets?.filter((x) => x.success && x.status === CouponStatus.closed);
    } else if (selectedStatus === "lost") {
      filtered = myBets?.filter((x) => !x.success && x.status === CouponStatus.closed);
    } else if (selectedStatus) {
      filtered = myBets?.filter((x) => x.status === selectedStatus);
    }

    if (selectedStatus === CouponStatus.active && filtered) {
      return [...filtered].sort((a, b) => {
        const dateA = a.matchid?.date ? new Date(a.matchid.date).getTime() : 0;
        const dateB = b.matchid?.date ? new Date(b.matchid.date).getTime() : 0;
        return dateA - dateB;
      });
    }

    return filtered;
  }, [myBets, selectedStatus]);

  const handleEditRow = (coupon: Bet) => {
    setSelectedMatch({ ...coupon.matchid, userbet: [coupon] });
    setSelectedBet(coupon);
    setIsBetModalOpen(true);
  };

  const handleDeleteRow = (coupon: Bet) => {
    deleteBetMutation.mutate(coupon._id, {
      onSuccess: () => {
        setIsConfirmModalOpen(false);
        setSelectedBet(null);
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError) {
          console.log("Error deleting bet:", error.response?.data?.message || error.message);
        } else {
          console.error("Error deleting bet:", error);
        }
      },
    });
  };

  // Szinkronizáljuk a selectedMatch-et a frissült adatokkal amikor változnak az odds-ok
  useEffect(() => {
    if (selectedMatch && isBetModalOpen) {
      const updatedBet = myBets?.find((bet) => bet.matchid._id === selectedMatch._id);
      if (updatedBet && selectedBet) {
        setSelectedMatch({ ...updatedBet.matchid, userbet: [selectedBet] });
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
        const favoriteTeam = userFavoriteTeam(bet.matchid);

        return (
          <div className="flex flex-col gap-0.5 py-1">
            {canViewDetails ? (
              <Link
                to={`/merkozesek/${bet.matchid?._id}`}
                className="font-semibold text-accent-soft hover:text-highlight transition-colors hover:underline"
              >
                {matchName}
              </Link>
            ) : (
              <span className="font-semibold text-white">{matchName}</span>
            )}
            {favoriteTeam && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-badge-amber">
                <IoStar size={10} />
                Kedvenc csapatod: {favoriteTeam.name}
              </span>
            )}
          </div>
        );
      },
      sortable: true,
      width: "3fr",
    },
    {
      header: "Kimenetel",
      key: "outcome",
      render: (bet: Bet) => {
        if (bet.type === CouponType.scoreBet) {
          const label = `${bet.scoreTeamA} - ${bet.scoreTeamB}`;
          return (
            <span className="block w-full truncate text-text-secondary" title={label}>
              {label}
            </span>
          );
        }
        const team =
          bet.outcome === MatchOutcome.home
            ? bet?.matchid?.teamA
            : bet.outcome === MatchOutcome.away
              ? bet?.matchid?.teamB
              : undefined;
        const label = team?.name ?? "Döntetlen";
        return (
          <div className="flex min-w-0 items-center gap-2">
            {team?.flag && (
              <img
                src={`${APP_CONFIG.FLAG_PATH}${team.flag}`}
                alt={team.name}
                className="h-5 w-5 shrink-0 rounded-full border border-white/10 object-cover"
              />
            )}
            <span className="truncate text-text-secondary" title={label}>
              {label}
            </span>
          </div>
        );
      },
      sortable: true,
      width: "2fr",
    },
    {
      header: "Odds",
      key: "odds",
      render: (bet) => {
        const isScoreBet = bet.type === CouponType.scoreBet;
        if (isScoreBet) {
          return <span className="text-text-muted">-</span>;
        }
        const hasFavoriteTeam = !!userFavoriteTeam(bet.matchid);
        const displayOdds = hasFavoriteTeam
          ? bet.odds * (config?.favoritTeamFactor || 1)
          : bet.odds;

        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex min-w-[3.25rem] items-center justify-center rounded-md px-2 py-1
                text-sm font-black tabular-nums ${
                  hasFavoriteTeam
                    ? "border border-badge-amber/40 bg-badge-amber/15 text-badge-amber shadow-[0_0_10px_-2px_rgba(245,165,36,0.6)]"
                    : "border border-white/10 bg-white/5 text-white"
                }`}
            >
              {displayOdds?.toFixed(2)}
            </span>
            {hasFavoriteTeam && (
              <span className="text-[9px] font-bold uppercase tracking-wide text-badge-amber">
                ×{config?.favoritTeamFactor}
              </span>
            )}
          </div>
        );
      },
      sortable: true,
    },
    {
      header: "Tét",
      key: "amount",
      render: (bet) => <span className="text-text-secondary">{bet.amount}</span>,
      sortable: true,
    },
    {
      header: "Státusz",
      key: "status",
      render: (bet) => (
        <span
          className={`${getCouponStatusInfo(bet.status).color} px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
            getCouponStatusInfo(bet.status).className
          }`}
        >
          {getCouponStatusInfo(bet.status).text}
        </span>
      ),
      sortable: true,
      width: "1fr",
    },
    {
      header: "Eredmény",
      key: "result",
      render: (bet) => (
        <span className="text-text-secondary">
          {bet.status === CouponStatus.closed && bet.success === true ? (
            <div className="flex items-center gap-2 text-badge-success font-semibold">
              Nyert <MdOutlinePriceCheck className="text-badge-success" size={20} />
            </div>
          ) : bet.status === CouponStatus.closed && bet.success === false ? (
            <span className="text-badge-live font-semibold">Vesztett</span>
          ) : (
            "-"
          )}
        </span>
      ),
      sortable: true,
      width: "1fr",
    },
    {
      header: "Nyeremény",
      key: "totalWin",
      valueBySort: (bet) => bet.totalWin,
      render: (bet) => {
        const isScoreBet = bet.type === CouponType.scoreBet;
        const hasFavoriteTeam = userFavoriteTeam(bet.matchid);
        const favoritTeamFactor = hasFavoriteTeam ? config?.favoritTeamFactor : 1;
        const shouldShowPotentialWinnings =
          bet.status === CouponStatus.active || (bet.status === CouponStatus.closed && bet.success);
        const winnings =
          bet.status === CouponStatus.active
            ? potentialWinnings(bet.amount, bet.odds, favoritTeamFactor)
            : bet.totalWin;
        const showProfit = bet.status === CouponStatus.closed && bet.success;
        const profit = showProfit ? bet.totalWin - bet.amount : 0;

        return (
          <div className="flex flex-col">
            <span className="font-bold text-white">
              {isScoreBet ? "-" : shouldShowPotentialWinnings ? formatNumber(winnings) : 0}
            </span>
            {showProfit && (
              <span className="text-[10px] font-medium text-badge-success">+{profit} profit</span>
            )}
          </div>
        );
      },
      sortable: true,
      width: "1fr",
    },
    {
      header: "",
      key: "actions",
      render: (coupon) =>
        coupon.status === CouponStatus.active &&
        coupon.matchid?.status !== MatchStatus.playing ? (
          <div className="flex gap-1">
            <button
              className="p-1.5 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Módosítás"
              onClick={() => handleEditRow(coupon)}
            >
              <MdEdit size={15} />
            </button>
            <button
              className="p-1.5 rounded-full text-badge-live hover:bg-badge-live-bg transition-colors cursor-pointer"
              title="Törlés"
              onClick={() => {
                setSelectedBet(coupon);
                setIsConfirmModalOpen(true);
              }}
            >
              <IoTrashOutline size={15} />
            </button>
          </div>
        ) : null,
      sortable: false,
      width: "w-16",
      className: "justify-center",
    },
  ];

  const filterBaseClass =
    "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors focus:outline-none cursor-pointer";
  const filterInactiveClass = "bg-white/5 border-white/10 text-text-secondary hover:bg-white/10";

  return (
    <div className="px-2">
      <h1 className="flex items-center gap-2 text-white text-center sm:text-left text-xl sm:text-2xl font-bold">
        <IoTicketOutline className="hidden sm:inline text-accent-soft" />
        Fogadásaim
      </h1>

      {/* Horizontális scrollozható filter tag-ek */}
      <div className="flex gap-2 overflow-x-auto py-3 px-2 scrollbar-hide">
        <button
          type="button"
          className={`${filterBaseClass} ${
            selectedStatus === null
              ? "bg-accent/20 border-accent/40 text-white"
              : filterInactiveClass
          }`}
          onClick={() => setSelectedStatus(null)}
        >
          Mind
        </button>
        <button
          type="button"
          className={`${filterBaseClass} ${
            selectedStatus === "win"
              ? "bg-badge-success-bg border-badge-success-border text-badge-success"
              : filterInactiveClass
          }`}
          onClick={() => setSelectedStatus("win")}
        >
          Nyertes
        </button>
        <button
          type="button"
          className={`${filterBaseClass} ${
            selectedStatus === "lost"
              ? "bg-badge-live-bg border-badge-live-border text-badge-live"
              : filterInactiveClass
          }`}
          onClick={() => setSelectedStatus("lost")}
        >
          Vesztes
        </button>
        {[CouponStatus.active, CouponStatus.closed].map((type) => (
          <button
            key={type}
            type="button"
            className={`${filterBaseClass} ${
              selectedStatus === type
                ? getCouponStatusInfo(type).selectedColor
                : filterInactiveClass
            }`}
            onClick={() => setSelectedStatus(type)}
          >
            {getCouponStatusInfo(type).text}
          </button>
        ))}
      </div>

      {!showCardView && (
        <section>
          <Table
            data={filteredCoupon || []}
            columns={columns}
            pageSize={10}
            emptyMessage="Még nincsenek fogadásaid"
            className="mt-4"
            loading={myBetsLoading || deleteBetMutation.isPending}
            error={myBetsError?.message && "Valami hiba történt, kérlek próbáld újra később."}
            itemLabel="fogadás"
          />
        </section>
      )}
      {showCardView && (
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
        <BetModal
          key={selectedMatch._id}
          match={selectedMatch}
          isOpen={isBetModalOpen}
          onClose={() => setIsBetModalOpen(false)}
          onAfterClose={() => {
            setSelectedMatch(null);
            setSelectedBet(null);
          }}
          onAfterSave={() => {
            setIsBetModalOpen(false);
            setIsConfirmModalOpen(false);
            queryClient.invalidateQueries({ queryKey: playersKeys.myBets() });
          }}
          disableTabs={Object.values(CouponType).filter((type) => type !== selectedBet?.type)}
          selectedTab={selectedBet?.type}
          bets={myBets || []}
          hideTabbar={true}
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
