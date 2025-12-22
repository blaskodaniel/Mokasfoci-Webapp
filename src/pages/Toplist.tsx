import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/types";
import { useToplist } from "@/hooks/api/usePlayers";
import type { User } from "@/models/user.type";

const ToplistPage = () => {
  const {
    data: toplist,
    isLoading: toplistLoading,
    error: toplistError,
  } = useToplist();

  const columns: Column<User>[] = [
    {
      header: "#",
      key: "position",
      render: (_, i) => <div>{i + 1}</div>,
      sortable: true,
      width: "w-24",
    },
    {
      header: "Játékos",
      key: "username",
      render: (user) => (
        <div className="font-semibold">{user?.username || ""}</div>
      ),
      sortable: true,
      width: "w-40",
    },
    {
      header: "Elérhető pont",
      key: "data.availableScore",
      render: (user) => <div>{user?.data.availableScore}</div>,
      sortable: true,
    },
    {
      header: "Nyeremény",
      key: "data.profitScore",
      render: (user) => <div>{user?.data.profitScore}</div>,
      sortable: true,
    },
  ];
  return (
    <div>
      <div className="text-white text-2xl">Toplista</div>
      <section>
        <Table
          data={toplist || []}
          columns={columns}
          pageSize={10}
          emptyMessage="Még nincsenek mérkőzések"
          className="mt-4"
          loading={toplistLoading}
          error={
            toplistError?.message &&
            "Valami hiba történt, kérlek próbáld újra később."
          }
        />
      </section>
    </div>
  );
};

export default ToplistPage;
