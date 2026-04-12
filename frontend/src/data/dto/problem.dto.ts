import type { ReturnTestCaseDto } from "./test-case.dto";

export type Problem = {
  id: number;
  title: string;
  points: number;
  author: string;
  description: string;
  input_description: string;
  output_description: string;
  input_example: string;
  output_example: string;
  total_submitted: number;
  total_accepted: number;
  difficulty: string;
  categories: Category[];
  test_cases: ReturnTestCaseDto[];
  creation_date: Date;
};

export type CreateProblemForm = {
  title: string;
  author: string;
  points: string;
  difficulty: string;
  categories: string[];
  description: string;
  inputDescription: string;
  outputDescription: string;
  inputExample: string;
  outputExample: string;
  testCaseInput: string;
  testCaseOutput: string;
};

export type Category = {
  id: number;
  id_problem: number;
  category: string;
};

export type CategoryDto = {
  value: string;
  label: string;
};
