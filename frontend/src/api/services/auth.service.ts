import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from "../../data/dto/auth.dto";
import { api } from "../api.client";

export const authService = {
  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    try {
      const { email, password } = loginData;
      const { data } = await api.post<AuthResponseDto>("/auth/login", {
        email: email,
        password: password,
      });

      return data;
    } catch (e) {
      console.error(
        "Error while realizing login:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },

  async register(registerData: RegisterDto): Promise<AuthResponseDto> {
    try {
      const { username, email, password } = registerData;
      const { data } = await api.post<AuthResponseDto>("/auth/register", {
        username: username,
        email: email,
        password: password,
      });

      return data;
    } catch (e) {
      console.error(
        "Error while registering:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },
};
