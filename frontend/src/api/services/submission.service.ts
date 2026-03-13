import type {
  ExecuteCodeResponseDto,
  Submission,
  SubmissionRequestDto,
} from "../../data/dto/submission.dto";
import type { TestCase } from "../../data/dto/test-case.dto";
import { api } from "../api.client";

export const submissionService = {
  async createSubmission(payload: SubmissionRequestDto): Promise<Submission> {
    try {
      const { data } = await api.post<Submission>("/submission", {
        id_user: payload.id_user,
        id_problem: payload.id_problem,
        text: payload.text,
        language: payload.language,
      });

      return data;
    } catch (e) {
      console.error(
        "Error while creating submission:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },

  async submitPlayground(payload: SubmissionRequestDto): Promise<TestCase> {
    try {
      const { data } = await api.post<TestCase>("/submission/playground", {
        id_user: payload.id_user,
        id_problem: payload.id_problem,
        text: payload.text,
        language: payload.language,
      });
      return data;
    } catch (e) {
      console.error(
        "Error while creating playground submission:",
        e instanceof Error ? e.message : "Unknown Error",
      );
      throw e;
    }
  },
};
