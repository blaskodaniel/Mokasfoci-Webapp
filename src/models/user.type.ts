import type { UserRole } from "@/state/enums";
import type { Team } from "./team.type";

interface UserData {
  teamid: Team;
  winteamid: Team;
  A: Team;
  B: Team;
  C: Team;
  D: Team;
  E: Team;
  F: Team;
  G: Team;
  H: Team;
  I: Team;
  J: Team;
  K: Team;
  L: Team;
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
