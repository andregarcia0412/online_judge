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
