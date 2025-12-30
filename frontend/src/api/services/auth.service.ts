import type { LoginResponseDto } from "../../data/dto/auth.dto";
import { LoginSchema } from "../../validations/login.schema";
import { api } from "../api.client";

export const login = async (
  email: string,
  password: string
): Promise<LoginResponseDto> => {
  const parsed = LoginSchema.safeParse({ email, password });

  if (!parsed.success) {
    throw parsed.error;
  }

  const response = await api.post<LoginResponseDto>("/auth/login", {
    email: email,
    password: password,
  });

  return response.data;
};
