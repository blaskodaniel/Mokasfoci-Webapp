export interface Column<T> {
  header: string;
  key: string;
  render: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string; // pl. "w-24", "w-32"
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string;
}

export type SortDirection = "asc" | "desc" | null;
