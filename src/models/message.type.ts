import type { MessageType } from "@/utils/enums";

export interface Message {
  _id: string;
  userId: string;
  text: string;
  type: MessageType;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
