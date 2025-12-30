import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await localStorage.getItem("@token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
