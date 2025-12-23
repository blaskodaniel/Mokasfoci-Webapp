import type { UserRole } from "@/state/enums";

interface UserData {
  teamid: string;
  winteamid: string;
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
  G: string;
  H: string;
  I: string;
  J: string;
  K: string;
  L: string;
  profitScore: number;
  availableScore: number;
  notbetcount: number;
  winteamcount: number;
  couponwin: number;
  couponlost: number;
  coupons: number;
}

export interface User {
  _id: string;
  data: UserData;
  username: string;
  active: boolean;
  name?: string;
  email: string;
  avatar?: string;
  role: UserRole;
  [key: string]: unknown;
}
