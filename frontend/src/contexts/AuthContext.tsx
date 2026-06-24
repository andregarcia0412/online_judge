import React from "react";
import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from "../data/dto/auth.dto";
import { api } from "../api/api.client";
import { loginService, registerService } from "../api/services/auth.service";
import { userService } from "../api/services/user.service";
import type { User } from "../data/dto/user.dto";

type AuthContextType = {
  tokens: AuthResponseDto | null;
  user: User | null;
  isLoading: boolean;
  login: (data: LoginDto, rememberMe: boolean) => Promise<void>;
  register: (data: RegisterDto, rememberMe: boolean) => Promise<void>;
  getUserData: () => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [tokens, setTokens] = React.useState<AuthResponseDto | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData =
          localStorage.getItem("tokens") || sessionStorage.getItem("tokens");

        if (!storedData) {
          return;
        }

        const parsedStoredData: AuthResponseDto = JSON.parse(storedData);
        setTokens(parsedStoredData);

        api.defaults.headers.common["Authorization"] =
          `Bearer ${parsedStoredData.access_token}`;

        await getUserData();
      } catch (e) {
        console.error(
          "Error loading token:",
          e instanceof Error ? e.message : "Unknown Error",
        );
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const login = async (loginData: LoginDto, rememberMe: boolean) => {
    const response = await loginService(loginData);

    if (!response) {
      throw new Error("Email ou senha incorretos");
    }

    setTokens(response);
    api.defaults.headers.common["Authorization"] =
      `Bearer ${response.access_token}`;

    if (rememberMe) {
      localStorage.setItem("tokens", JSON.stringify(response));
      sessionStorage.removeItem("tokens");
    } else {
      sessionStorage.setItem("tokens", JSON.stringify(response));
      localStorage.removeItem("tokens");
    }

    await getUserData();
  };

  const register = async (registerData: RegisterDto, rememberMe: boolean) => {
    const response = await registerService(registerData);

    if (!response) {
      throw new Error("Erro ao registrar");
    }

    setTokens(response);
    api.defaults.headers.common["Authorization"] =
      `Bearer ${response.access_token}`;

    if (rememberMe) {
      localStorage.setItem("tokens", JSON.stringify(response));
      sessionStorage.removeItem("tokens");
    } else {
      sessionStorage.setItem("tokens", JSON.stringify(response));
      localStorage.removeItem("tokens");
    }

    await getUserData();
  };

  const getUserData = async () => {
    const response = await userService.getCurrentUser();
    setUser(response);
  };

  return (
    <AuthContext.Provider
      value={{ tokens, user, isLoading, login, register, getUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside an AuthProvider");
  }

  return context;
};
