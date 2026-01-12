import type { FC } from "react";
import Table from "../Table/Table";
import type { MatchesDesktopViewProps } from "./types";

const MatchesDesktopView: FC<MatchesDesktopViewProps> = ({
  matchesWithBets,
  columns,
  loading,
  error,
}) => {
  return (
    <Table
      data={matchesWithBets}
      columns={columns}
      pageSize={10}
      emptyMessage="Még nincsenek mérkőzések"
      className="mt-4"
      loading={loading}
      error={error}
    />
  );
};

export default MatchesDesktopView;
