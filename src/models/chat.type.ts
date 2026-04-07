import type { User } from "./user.type";

export interface ChatMessage {
  _id: string;
  sender: User;
  message: string;
  room: string;
  createdAt: Date;
  updatedAt: Date;
}
