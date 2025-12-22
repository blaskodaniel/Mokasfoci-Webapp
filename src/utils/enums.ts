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
  Quarterfinal = "Quarterfinal",
  RoundOf16 = "RoundOf16",
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
}

export enum TransactionType {
  bet = "bet",
  win = "win",
  penalty = "penalty",
  refund = "refund",
  initial = "initial",
  correction = "correction",
}
