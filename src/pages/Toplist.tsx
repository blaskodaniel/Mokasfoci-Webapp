import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useToplist } from "@/hooks/api/usePlayers";
import UserDisplay from "@/components/UserDisplay";
import UserDetailsModal from "@/components/UserDetailsModal";
import { useMemo, useState } from "react";
import useResponsive from "@/hooks/useResponsive";
import { formatNumber, getWinRatePercent } from "@/utils/common";
import ToplistMobileView from "@/components/Toplist/MobileView";
import ToplistHighlights from "@/components/Toplist/ToplistHighlights";
import MyRankCard from "@/components/Toplist/MyRankCard";
import type { ToplistRow } from "@/components/Toplist/types";
import ToplistTypeSwitcher from "@/components/Toplist/ToplistTypeSwitcher";
import { ToplistType } from "@/utils/enums";
import { useAuth } from "@/hooks/useAuth";

const ToplistPage = () => {
  const { isMobile } = useResponsive();
  const { user: currentUser } = useAuth();
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [toplistType, setToplistType] = useState(ToplistType.netscore);

  const { data: toplist, isLoading: toplistLoading, error: toplistError } = useToplist();

  const rows: ToplistRow[] = useMemo(
    () =>
      toplistType === ToplistType.netscore
        ? (toplist?.toplist ?? []).map((u) => ({
            id: u._id,
            username: u.username,
            name: u.name,
            avatar: u.avatar,
            primary: u.data.availableScore,
            secondary: u.data.profitScore,
            betCount: u.data.coupons,
            wins: u.data.couponwin,
            losses: u.data.couponlost,
          }))
        : (toplist?.roiList ?? []).map((r) => ({
            id: r.userid,
            username: r.username,
            name: r.name,
            avatar: r.avatar,
            primary: r.roi,
            secondary: r.totalWon - r.totalWagered,
            betCount: r.couponCount,
          })),
    [toplist?.roiList, toplist?.toplist, toplistType]
  );

  const myRankIndex = useMemo(
    () => (currentUser ? rows.findIndex((r) => r.id === currentUser._id) : -1),
    [rows, currentUser]
  );

  const columns: Column<ToplistRow>[] = [
    {
      header: "#",
      key: "position",
      render: (_, i) => (
        <div className="font-bold tabular-nums text-text-muted">{i + 4}</div>
      ),
      sortable: false,
      width: "w-16",
    },
    {
      header: "Játékos",
      key: "name",
      render: (user) => (
        <UserDisplay
          user={{
            _id: user.id,
            avatar: user.avatar,
            name: user.name,
            username: user.username,
          }}
          showAvatar={true}
          avatarSize="sm"
          nameClassName="text-text-primary"
          onClick={() => {
            setSelectedUserId(user.id);
            setIsUserDetailsModalOpen(true);
          }}
        />
      ),
      valueBySort: (user) => user.name ?? "",
      sortable: true,
      width: "2fr",
    },
    {
      header: "Fogadások",
      key: "betCount",
      render: (user) => {
        const winRate = getWinRatePercent(user.wins, user.losses);
        return (
          <div>
            <div className="font-semibold text-text-secondary">{user.betCount ?? 0} db</div>
            {winRate !== null && (
              <div className="text-[11px] text-text-muted">{winRate}% találat</div>
            )}
          </div>
        );
      },
      valueBySort: (user) => user.betCount ?? 0,
      sortable: true,
      width: "1fr",
    },
    {
      header: toplistType === ToplistType.netscore ? "Nyeremény" : "Összpont-Tét",
      key: "secondary",
      render: (user) => (
        <div className="tabular-nums text-text-secondary">{formatNumber(user?.secondary)}</div>
      ),
      valueBySort: (user) => user.secondary,
      sortable: true,
      width: "1fr",
    },
    {
      header: toplistType === ToplistType.netscore ? "Összpontszám" : "ROI",
      key: "primary",
      render: (user) => (
        <div className="font-black tabular-nums text-white">
          {formatNumber(user?.primary)} {toplistType === ToplistType.netscore ? "" : "%"}
        </div>
      ),
      valueBySort: (user) => user.primary,
      sortable: true,
      width: "1fr",
    },
  ];
  return (
    <div className="px-1.5">
      <div className="mb-3 px-2 sm:px-0">
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-soft">
          Versenyközpont
        </div>
        <h1 className="mt-1 text-2xl font-black text-text-primary sm:text-3xl">Ranglista</h1>
      </div>
      <ToplistTypeSwitcher toplistType={toplistType} setToplistType={setToplistType} />
      <section className="space-y-4">
        {!toplistLoading && !toplistError && (
          <ToplistHighlights
            users={rows}
            primaryLabel={toplistType === ToplistType.netscore ? "pont" : "%"}
            secondaryLabel={toplistType === ToplistType.netscore ? "nyeremény" : "nettó pont"}
            onSelect={(userId) => {
              setSelectedUserId(userId);
              setIsUserDetailsModalOpen(true);
            }}
          />
        )}
        {myRankIndex >= 3 && (
          <MyRankCard
            user={rows[myRankIndex]}
            rank={myRankIndex + 1}
            primaryLabel={toplistType === ToplistType.netscore ? "pont" : "%"}
            onSelect={(userId) => {
              setSelectedUserId(userId);
              setIsUserDetailsModalOpen(true);
            }}
          />
        )}
        {!isMobile && (
          <div>
            <Table
              data={rows?.slice(3) || []}
              columns={columns}
              pageSize={20}
              emptyMessage="Még nincsenek játékosok"
              className="mt-4"
              loading={toplistLoading}
              error={toplistError?.message && "Valami hiba történt, kérlek próbáld újra később."}
              itemLabel="játékos"
            />
          </div>
        )}
        {isMobile && (
          <ToplistMobileView
            users={rows.slice(3)}
            primaryLabel={toplistType === ToplistType.netscore ? "pont" : "%"}
            loading={toplistLoading}
            startPosition={4}
            error={toplistError?.message && "Valami hiba történt, kérlek próbáld újra később."}
            onSelect={(userId: string) => {
              setSelectedUserId(userId);
              setIsUserDetailsModalOpen(true);
            }}
          />
        )}
        {isMobile && !toplistLoading && !toplistError && rows.length === 0 && (
          <div className="rounded-tile border border-tile-border bg-[image:var(--tile-bg-gradient)] px-4 py-8 text-center text-sm text-text-muted shadow-tile">
            Még nincsenek játékosok a ranglistán.
          </div>
        )}
      </section>

      {selectedUserId && (
        <UserDetailsModal
          isOpen={isUserDetailsModalOpen}
          onClose={() => setIsUserDetailsModalOpen(false)}
          userId={selectedUserId}
        />
      )}
    </div>
  );
};

export default ToplistPage;
