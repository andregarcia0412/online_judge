import type { User } from "./user.dto";

export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  token: string;
  user: User;
};

export type RegisterDto = {
  email: string;
  username: string;
  password: string;
};

export type RegisterResponseDto = {
  user: User;
};
