import { api } from "../api.client";

export const userService = {
  async getSubmissionsById(id: string) {
    try {
      const { data } = await api.get(`/user/${id}/submission`);
      return data;
    } catch (e) {
      console.error(
        "Error while getting user submissions:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },

  async getUserById(id: string) {
    try {
      const { data } = await api.get(`/user/${id}`);
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
