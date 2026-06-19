export interface Column<T> {
  header: string;
  key: string;
  render: (item: T, index: number) => React.ReactNode;
  valueBySort?: (item: T) => string | number;
  sortable?: boolean;
  width?: string; // pl. "w-24", "w-32"
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string;
  itemLabel?: string;
}

export type SortDirection = "asc" | "desc" | null;
