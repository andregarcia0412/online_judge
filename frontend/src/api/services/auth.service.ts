import type { LoginDto, LoginResponseDto } from "../../data/dto/auth.dto";
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
