import type { NotificationType } from "@/utils/enums";

export interface AppNotification {
  _id: string;
  userId: string;
  text: string;
  type: NotificationType;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
