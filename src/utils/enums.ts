export enum MatchStatus {
  disabled = "disabled",
  enabled = "enabled",
  playing = "playing",
  finished = "finished",
  posponted = "postponted",
}

export enum MatchOutcome {
  home = "1",
  draw = "x",
  away = "2",
}

export enum MatchType {
  Final = "Final",
  Semifinal = "Semifinal",
  ThirdPlacePlayoff = "ThirdPlacePlayoff",
  Quarterfinal = "Quarterfinal",
  RoundOf16 = "RoundOf16",
  RoundOf32 = "RoundOf32",
  GroupStageRound1 = "GroupStageRound1",
  GroupStageRound2 = "GroupStageRound2",
  GroupStageRound3 = "GroupStageRound3",
}

export enum CouponStatus {
  inactive = "inactive",
  active = "active",
  closed = "closed",
  inprogress = "inprogress",
  processed = "processed",
}

export enum CouponType {
  outcomeBet = "outcomeBet",
  notBetFine = "notBetFine",
  advancementBet = "advancementBet",
  scoreBet = "scoreBet",
}

export enum TransactionType {
  bet = "bet",
  win = "win",
  penalty = "penalty",
  refund = "refund",
  initial = "initial",
  correction = "correction",
  betModification = "betModification",
  reward = "reward",
}

export enum BadgeType {
  // Széria badge-ek
  hotStreak = "hotStreak", // 3 egymást követő eltalált kimenetel
  onFire = "onFire", // 5 egymást követő eltalált kimenetel

  // Stratégiai badge-ek
  groupOracle = "groupOracle", // Csoportgyőztes eltalálás
  championVisionary = "championVisionary", // Bajnok csapat eltalálás

  sharpshooter = "sharpshooter", // 1 eltalált pontos végeredmény (Mesterlövész)
  clairvoyant = "clairvoyant", // 3 eltalált pontos végeredmény (Látnok)
  nostradamus = "nostradamus", // 5 eltalált pontos végeredmény (Nostradamus)

  // Kombinált és speciális badge-ek
  secondSight = "secondSight", // 2 egymást követő eltalált pontos végeredmény (Második Látás)
  boreDraw = "boreDraw", // Sikeres 0-0 tipp (Betonvédelem)
  doubleDynamite = "doubleDynamite", // Egyazon mec
}

export enum ChatMessageType {
  system = "system",
  user = "user",
}

export enum NotificationType {
  system = "system",
  achievementUnlocked = "achievementUnlocked",
  oddsUpdate = "oddsUpdate",
}

export const getNotificationTitle = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.system:
      return "Rendszerüzenet";
    case NotificationType.achievementUnlocked:
      return "Új jelvényt kaptál!";
    case NotificationType.oddsUpdate:
      return "Szorzóváltozás történt";
    default:
      return "Új értesítés";
  }
};

export enum UserRole {
  Admin = "admin",
  User = "user",
}
