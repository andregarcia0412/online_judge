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

export type ProblemList = {
  problems: Problem[];
  page: number;
  limit: number;
  total_pages: number;
};

export type CreateProblemForm = {
  title: string;
  author: string;
  points: string;
  difficulty: string;
  categories: CategoryDto[];
  description: string;
  inputDescription: string;
  outputDescription: string;
  inputExample: string;
  outputExample: string;
  testCaseInput: string;
  testCaseOutput: string;
};

export type CreateProblemDto = {
  title: string;
  points: number;
  author: string;
  description: string;
  input_description: string;
  output_description: string;
  input_example: string;
  output_example: string;
  difficulty: string;
  category: CreateCategoryDto[];
  test_cases: CreateTestCaseDto[];
};

export type Category = {
  id: number;
  id_problem: number;
  category: string;
};

export type CreateCategoryDto = {
  category: string;
};

export type CategoryDto = {
  value: string;
  label: string;
};

export type TestCase = {
  id_test_case: number;
  id_problem: number;
  input: string;
  output: string;
  memory_usage_MB: number;
};

export type ReturnTestCaseDto = {
  id: string;
  id_problem: number;
  input: string;
  output: string;
};

export type CreateTestCaseDto = {
  id_problem?: number;
  input: string;
  output: string;
};
