import type { User } from "@/models/user.type";

export interface ToplistProps {
  users: User[];
  loading?: boolean;
  error?: string;
  onSelect?: (userId: string) => void;
}
