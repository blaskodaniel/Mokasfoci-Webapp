import type { Group } from "./group.type";

export interface Team {
  _id: string;
  groupid: Group;
  name: string;
  tla: string;
  flag?: string | null;
  win: number | null;
  draw: number | null;
  loss: number | null;
  score: number | null;
  getgoal: number | null;
  kickgoal: number | null;
  active: boolean | null;
  isTournamentWinner?: boolean;
  position: number;
  playedGames: number;
  goalDifference: number;
  [key: string]: unknown;
}
