import type { User } from "../models/user.type";

export interface SignInResponse {
  token: string;
  user: User;
}

export interface SignUpResponse {
  username: string;
  email: string;
  password: string;
  invitationCode?: string;
}
