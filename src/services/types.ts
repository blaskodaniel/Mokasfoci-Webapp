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

export interface UpdateUserProfileBody {
  name?: string;
  teamid?: string;
  winteamid?: string;
  A?: string;
  B?: string;
  C?: string;
  D?: string;
  E?: string;
  F?: string;
  G?: string;
  H?: string;
  I?: string;
  J?: string;
  K?: string;
  L?: string;
}

export interface DefaultAvatar {
  filename: string;
  name: string;
  path: string;
}
