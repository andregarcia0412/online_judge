import type {
  CategoryDto,
  CreateProblemDto,
  Problem,
  ProblemList,
  TestCase,
} from "../../data/dto/problem.dto";
import { api } from "../api.client";

export const problemService = {
  async create(createProblemDto: CreateProblemDto): Promise<Problem> {
    try {
      const { data } = await api.post(`/problem`, createProblemDto);
      return data;
    } catch (e) {
      console.error(
        "Error while creating problem",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },

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

  async findAll(page: number, limit: number): Promise<ProblemList> {
    try {
      const { data } = await api.get(`/problem?page=${page}&limit=${limit}`);
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
