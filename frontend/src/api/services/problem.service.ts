import type { CategoryDto, Problem } from "../../data/dto/problem.dto";
import type { TestCase } from "../../data/dto/test-case.dto";
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

  async findAllTestCasesById(id: number): Promise<TestCase[]> {
    try {
      const { data } = await api.get(`/problem/${id}/test-case`);

      return data;
    } catch (e) {
      console.error(
        "Error while getting test cases:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },

  async findAll(): Promise<Problem[]> {
    try {
      const { data } = await api.get("/problem");
      return data;
    } catch (e) {
      console.error(
        "Error while getting problems:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },

  async findAllCategories(): Promise<CategoryDto[]> {
    try {
      const { data } = await api.get("/category");
      return data;
    } catch (e) {
      console.error(
        "Error while getting categories:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },
};
