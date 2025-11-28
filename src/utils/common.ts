import { CouponStatus } from "./enums";

export const getStatusInfo = (
  status: CouponStatus
): { color: string; text: string } => {
  switch (status) {
    case CouponStatus.active:
      return { color: "bg-green-600", text: "Aktív" };
    case CouponStatus.inactive:
      return { color: "bg-gray-600", text: "Inaktív" };
    case CouponStatus.inprogress:
      return { color: "bg-red-600", text: "Folyamatban" };
    default:
      return { color: "bg-yellow-600", text: "Ismeretlen" };
  }
};
