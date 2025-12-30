import type { Group } from "./group.type";

export interface Team {
  _id: string;
  groupid: Group
  name: string;
  flag?: string | null;
  win?: number | null;
  draw?: number | null;
  loss?: number | null;
  score?: number | null;
  getgoal?: number | null;
  kickgoal?: number | null;
  active?: boolean | null;
  isTournamentWinner?: boolean;
  [key: string]: unknown;
}
