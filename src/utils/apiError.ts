import { AxiosError } from "axios";

export class ApiError extends Error {
  status: number;
  msg: string;

  constructor(msg: string, status: number) {
    super(msg);
    this.status = status;
    this.msg = msg;
    this.name = "ApiError";
  }

  static getErrorMessage(error: unknown, defaultMsg = "Ismeretlen hiba történt"): string {
    if (error instanceof ApiError) {
      return error.msg || error.message || defaultMsg;
    }
    if (error instanceof AxiosError) {
      const data = error.response?.data as { msg?: string };
      return data?.msg || error.message || defaultMsg;
    }
    if (error instanceof Error) {
      return error.message || defaultMsg;
    }
    if (typeof error === "string") {
      return error;
    }
    return defaultMsg;
  }
}
