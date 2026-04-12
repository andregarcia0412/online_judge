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
