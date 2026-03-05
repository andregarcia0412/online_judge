import type { Problem } from "../../data/dto/problem.dto";
import { api } from "../api.client";

export const problemService = {
  async findById(id: number): Promise<Problem> {
    try {
      const { data } = await api.get(`/problem/${id}`);

      return data;
    } catch (e) {
      console.error(
        "Error while finding problem:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },
};
