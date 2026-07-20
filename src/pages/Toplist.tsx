import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useToplist } from "@/hooks/api/usePlayers";
import UserDisplay from "@/components/UserDisplay";
import UserDetailsModal from "@/components/UserDetailsModal";
import { useMemo, useState } from "react";
import useResponsive from "@/hooks/useResponsive";
import { formatNumber } from "@/utils/common";
import ToplistMobileView from "@/components/Toplist/MobileView";
import type { ToplistRow } from "@/components/Toplist/types";
import ToplistTypeSwitcher from "@/components/Toplist/ToplistTypeSwitcher";
import { ToplistType } from "@/utils/enums";

const ToplistPage = () => {
  const { isMobile } = useResponsive();
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
          }))
        : (toplist?.roiList ?? []).map((r) => ({
            id: r.userid,
            username: r.username,
            name: r.name,
            avatar: r.avatar,
            primary: r.roi,
            secondary: r.totalWon - r.totalWagered,
          })),
    [toplist?.roiList, toplist?.toplist, toplistType]
  );

  const columns: Column<ToplistRow>[] = [
    {
      header: "#",
      key: "position",
      render: (_, i) => <div>{i + 1}</div>,
      sortable: true,
      width: isMobile ? "w-8" : "w-24",
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
          onClick={() => {
            setSelectedUserId(user.id);
            setIsUserDetailsModalOpen(true);
          }}
        />
      ),
      valueBySort: (user) => user.name ?? "",
      sortable: true,
    },
    {
      header: toplistType === ToplistType.netscore ? "Nyeremény" : "Összpont-Tét",
      key: "secondary",
      render: (user) => <div>{formatNumber(user?.secondary)}</div>,
      valueBySort: (user) => user.secondary,
      sortable: true,
    },
    {
      header: toplistType === ToplistType.netscore ? "Összpontszám" : "ROI",
      key: "primary",
      render: (user) => (
        <div>
          {formatNumber(user?.primary)} {toplistType === ToplistType.netscore ? "" : "%"}
        </div>
      ),
      valueBySort: (user) => user.primary,
      sortable: true,
    },
  ];
  return (
    <div className="px-1.5">
      <div className="text-white text-2xl">Ranglista</div>
      <ToplistTypeSwitcher toplistType={toplistType} setToplistType={setToplistType} />
      <section>
        {!isMobile && (
          <div className="mb-3">
            <Table
              data={rows || []}
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
            users={rows || []}
            primaryLabel={toplistType === ToplistType.netscore ? "pont" : "%"}
            loading={toplistLoading}
            secondaryPodiumLabel={toplistType === ToplistType.netscore ? "" : "%"}
            error={toplistError?.message && "Valami hiba történt, kérlek próbáld újra később."}
            onSelect={(userId: string) => {
              setSelectedUserId(userId);
              setIsUserDetailsModalOpen(true);
            }}
          />
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
