import type { TransactionType } from "@/utils/enums";
import type { Bet } from "./bet.type";
import type { Match } from "./match.type";
import type { User } from "./user.type";

export interface Transaction {
  _id: string;
  userid: User;
  amount: number;
  type: TransactionType;
  date: string;
  comment: string;
  matchid?: Match;
  couponid?: Bet;
  [key: string]: unknown;
}
