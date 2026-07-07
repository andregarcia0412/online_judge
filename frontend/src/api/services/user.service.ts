import { api } from "../api.client";

export const userService = {
  async getCurrentUser() {
    try {
      const { data } = await api.get(`/user/me`);
      return data;
    } catch (e) {
      console.error(
        "Error while fetching user data:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },
};
