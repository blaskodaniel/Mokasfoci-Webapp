import type { User } from "./user.type";
import type { ChatMessageType } from "@/utils/enums";

export interface ChatMessage {
  _id: string;
  sender?: User;
  type: ChatMessageType;
  message: string;
  room: string;
  createdAt: Date;
  updatedAt: Date;
}
