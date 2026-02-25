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
    description: "3 egymást követő sikeres fogadás széria jelvény.",
  },
  [BadgeType.onFire]: {
    filename: "on_fire.svg",
    label: "On Fire",
    description: "5 egymást követő sikeres fogadás széria jelvény.",
  },
  [BadgeType.groupOracle]: {
    filename: "group_oracle.svg",
    label: "Group Oracle",
    description: "Csoport győztes tipp jelvény.",
  },
  [BadgeType.championVisionary]: {
    filename: "champion_visionary.svg",
    label: "Champion Visionary",
    description: "Bajnokcsapat tipp jelvény.",
  },
  [BadgeType.sharpshooter]: {
    filename: "sharpshooter.svg",
    label: "Mesterlövész",
    description: "1 eltalált pontos végeredmény.",
  },
  [BadgeType.clairvoyant]: {
    filename: "clairvoyant.svg",
    label: "Látnok",
    description: "3 eltalált pontos végeredmény.",
  },
  [BadgeType.nostradamus]: {
    filename: "nostradamus.svg",
    label: "Nostradamus",
    description: "5 eltalált pontos végeredmény.",
  },
  [BadgeType.secondSight]: {
    filename: "second_sight.svg",
    label: "Második Látás",
    description: "2 egymást követő eltalált pontos végeredmény.",
  },
  [BadgeType.boreDraw]: {
    filename: "bore_draw.svg",
    label: "Betonvédelem",
    description: "Sikeres 0-0 tipp.",
  },
  [BadgeType.doubleDynamite]: {
    filename: "double_dynamite.svg",
    label: "Double Dynamite",
    description: "Egyazon meccsre 2 sikeres fogadás.",
  },
};
