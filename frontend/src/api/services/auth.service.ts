import type {
  LoginDto,
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto,
} from "../../data/dto/auth.dto";
import { api } from "../api.client";

export const loginService = async (
  loginData: LoginDto
): Promise<LoginResponseDto> => {
  const { email, password } = loginData;
  const response = await api.post<LoginResponseDto>("/auth/login", {
    email: email,
    password: password,
  });

  return response.data;
};

export const registerService = async (
  registerData: RegisterDto
): Promise<RegisterResponseDto> => {
  const { username, email, password } = registerData;

  const response = await api.post<RegisterResponseDto>("/user", {
    username: username,
    email: email,
    password: password,
  });

  return response.data;
};
