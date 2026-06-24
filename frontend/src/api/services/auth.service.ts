import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from "../../data/dto/auth.dto";
import { api } from "../api.client";

export const loginService = async (
  loginData: LoginDto,
): Promise<AuthResponseDto> => {
  const { email, password } = loginData;
  const { data } = await api.post<AuthResponseDto>("/auth/login", {
    email: email,
    password: password,
  });

  return data;
};

export const registerService = async (
  registerData: RegisterDto,
): Promise<AuthResponseDto> => {
  const { username, email, password } = registerData;

  const { data } = await api.post<AuthResponseDto>("/auth/register", {
    username: username,
    email: email,
    password: password,
  });

  return data;
};
