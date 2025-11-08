export class ApiError extends Error {
  status: boolean;

  constructor(message: string, status: boolean) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
