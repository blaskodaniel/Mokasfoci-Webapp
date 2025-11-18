import type { Team } from "./team.type";

export interface Group {
  _id: string;
  name: string;
  winteamid?: Team;
}
