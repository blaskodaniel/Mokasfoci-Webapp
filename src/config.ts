import { BadgeType } from "./utils/enums";

export const APP_CONFIG = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
  FLAG_PATH: "/flags/",
};

export const APP_NAME = "FIFAWorldCup26";
export const DEFAULT_AVATAR_URL = "/default_avatar.png";
export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export const BADGE_CONFIG: Record<
  BadgeType,
  { filename: string; label: string; description: string }
> = {
  [BadgeType.hotStreak]: {
    filename: "hot_streak.svg",
    label: "Hot Streak",
    description: "3 egymást követő sikeres tipp.",
  },
  [BadgeType.onFire]: {
    filename: "on_fire.svg",
    label: "On Fire",
    description: "5 egymást követő sikeres tipp.",
  },
  [BadgeType.groupOracle]: {
    filename: "group_oracle.svg",
    label: "Group Oracle",
    description: "Sikeresen megtippelted egy csoport győztesét.",
  },
  [BadgeType.championVisionary]: {
    filename: "champion_visionary.svg",
    label: "Champion Visionary",
    description: "Sikeresen megtippelted a bajnokcsapatot.",
  },
};
