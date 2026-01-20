import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useToplist } from "@/hooks/api/usePlayers";
import type { User } from "@/models/user.type";
import UserDisplay from "@/components/UserDisplay";
import UserDetailsModal from "@/components/UserDetailsModal";
import { useState } from "react";
import useResponsive from "@/hooks/useResponsive";
import { formatNumber } from "@/utils/common";
import ToplistMobileView from "@/components/Toplist/MobileView";

const ToplistPage = () => {
  const { isMobile } = useResponsive();
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: toplist, isLoading: toplistLoading, error: toplistError } = useToplist();

  const columns: Column<User>[] = [
    {
      header: "#",
      key: "position",
      render: (_, i) => <div>{i + 1}</div>,
      sortable: true,
      width: isMobile ? "w-8" : "w-24",
    },
    {
      header: "Játékos",
      key: "username",
      render: (user) => (
        <UserDisplay
          user={user}
          showAvatar={true}
          avatarSize="sm"
          onClick={() => {
            setSelectedUserId(user._id);
            setIsUserDetailsModalOpen(true);
          }}
        />
      ),
      sortable: true,
    },
    {
      header: "Összpontszám",
      key: "data.availableScore",
      render: (user) => <div>{formatNumber(user?.data.availableScore)}</div>,
      sortable: true,
    },
    {
      header: "Nyeremény",
      key: "data.profitScore",
      render: (user) => <div>{formatNumber(user?.data.profitScore)}</div>,
      sortable: true,
    },
  ];
  return (
    <div className="px-1.5">
      <div className="text-white text-2xl">Toplista</div>
      <section>
        {!isMobile && (
          <Table
            data={toplist || []}
            columns={columns}
            pageSize={10}
            emptyMessage="Még nincsenek mérkőzések"
            className="mt-4"
            loading={toplistLoading}
            error={toplistError?.message && "Valami hiba történt, kérlek próbáld újra később."}
          />
        )}
        {isMobile && (
          <ToplistMobileView
            users={toplist || []}
            loading={toplistLoading}
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
