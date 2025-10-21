import type { UserRole } from "@/state/enums";

export interface User {
  _id: string;
  username: string;
  name?: string;
  email: string;
  avatar?: string;
  role: UserRole;
}
