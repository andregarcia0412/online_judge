import axios from "axios";
import type { AuthResponseDto } from "../data/dto/auth.dto";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const storedData =
      sessionStorage.getItem("tokens") || localStorage.getItem("tokens");

    let tokens: AuthResponseDto | null = null;

    if (storedData) {
      try {
        tokens = JSON.parse(storedData);
      } catch (e) {
        sessionStorage.removeItem("tokens");
        localStorage.removeItem("tokens");
        return Promise.reject(e);
      }
    }

    if (!tokens?.refresh_token) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((accessToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest);
        })
        .catch((e) => Promise.reject(e));
    }

    isRefreshing = true;

    try {
      const response = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        {
          refresh_token: tokens.refresh_token,
        },
      );

      const newToken = response.data.access_token;
      const newRefreshToken =
        response.data.refresh_token || tokens.refresh_token;

      const updatedData = {
        ...tokens,
        access_token: newToken,
        refresh_token: newRefreshToken,
      };

      const storage = localStorage.getItem("tokens")
        ? localStorage
        : sessionStorage;

      storage.setItem("tokens", JSON.stringify(updatedData));

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

      processQueue(null, newToken);

      return api(originalRequest);
    } catch (e) {
      sessionStorage.removeItem("tokens");
      localStorage.removeItem("tokens");
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);
