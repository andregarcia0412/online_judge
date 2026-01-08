import React from "react";
import type { LoginDto, LoginResponseDto } from "../data/dto/auth.dto";
import { api } from "../api/api.client";
import { loginService } from "../api/services/auth.service";

type AuthContextType = {
  userData: LoginResponseDto | null;
  isLoading: boolean;
  login: (data: LoginDto, rememberMe: boolean) => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType
);

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

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsedStoredData.token}`;
      } catch (e) {
        console.error(
          "Error loading token:",
          e instanceof Error ? e.message : "Unknown Error"
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
      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

      if (rememberMe) {
        localStorage.setItem("userData", JSON.stringify(response));
      } else {
        sessionStorage.setItem("userData", JSON.stringify(response));
        localStorage.removeItem("userData");
      }
    } catch (e) {
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ userData, isLoading, login }}>
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
