import type { BadgeType } from "@/utils/enums";

export interface Badge {
  _id: string;
  userid: string;
  type: BadgeType;
  count: number; // Hányszor kapta meg ezt a badge-et (pl. groupOracle esetén hány csoportot talált el)
  earnedAt: string;
  metadata?: {
    // Opcionális extra információk
    streakLength?: number; // Széria hossza amikor kapta
    teamName?: string; // Melyik csapat/csoport
    matchId?: string; // Melyik meccs után kapta
  };
}
