import React from "react";
import type { LoginDto, LoginResponseDto } from "../data/dto/auth.dto";
import { api } from "../api/api.client";
import { loginService } from "../api/services/auth.service";
import { userService } from "../api/services/user.service";

type AuthContextType = {
  userData: LoginResponseDto | null;
  isLoading: boolean;
  login: (data: LoginDto, rememberMe: boolean) => Promise<void>;
  getUserData: (id: string) => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userData, setUserData] = React.useState<LoginResponseDto | null>(null);
  const [isLoading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData =
          localStorage.getItem("userData") ||
          sessionStorage.getItem("userData");

        if (!storedData) {
          return;
        }

        const parsedStoredData: LoginResponseDto = JSON.parse(storedData);
        setUserData(parsedStoredData);

        api.defaults.headers.common["Authorization"] =
          `Bearer ${parsedStoredData.accessToken}`;
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
    try {
      const response = await loginService(loginData);

      if (!response) {
        throw new Error("Email ou senha incorretos");
      }

      setUserData(response);
      api.defaults.headers.common["Authorization"] =
        `Bearer ${response.accessToken}`;

      if (rememberMe) {
        localStorage.setItem("userData", JSON.stringify(response));
        sessionStorage.removeItem("userData");
      } else {
        sessionStorage.setItem("userData", JSON.stringify(response));
        localStorage.removeItem("userData");
      }
    } catch (e) {
      throw e;
    }
  };

  const getUserData = async (id: string) => {
    try {
      const response = await userService.getUserById(id);
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              user: response,
            }
          : prev,
      );

      const storage = localStorage.getItem("userData")
        ? localStorage
        : sessionStorage;

      const savedData = storage.getItem("userData");

      if (savedData) {
        const parsedData: LoginResponseDto = JSON.parse(savedData);
        parsedData.user = response;
        storage.setItem("userData", JSON.stringify(parsedData));
      }
    } catch (e) {
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ userData, isLoading, login, getUserData }}>
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
