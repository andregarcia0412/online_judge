export type LoginDto = {
  email: string;
  password: string;
};

export type AuthResponseDto = {
  access_token: string;
  refresh_token: string;
};

export type RegisterDto = {
  email: string;
  username: string;
  password: string;
};
