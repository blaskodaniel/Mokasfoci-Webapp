export interface ToplistRow {
  id: string;
  username: string;
  name?: string;
  avatar?: string;
  primary: number; // fő érték: nyeremény VAGY roi
  secondary: number; // másodlagos: összpontszám VAGY össznyeremény
  betCount?: number;
  wins?: number;
  losses?: number;
}

export interface ToplistProps {
  users: ToplistRow[];
  primaryLabel?: string; // pl. "pont" / "%"
  secondaryLabel?: string;
  secondaryPodiumLabel?: string;
  startPosition?: number;
  loading?: boolean;
  error?: string;
  onSelect?: (userId: string) => void;
}
