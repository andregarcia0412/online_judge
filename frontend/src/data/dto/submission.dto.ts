export type Submission = {
  id_submission: number;
  id_user: number;
  id_problem: number;
  text: string;
  language: string;
  status: string;
  execution_time: number;
  submission_date: Date;
  error?: string;
};

export type SubmissionRequestDto = {
  id_user: string;
  id_problem: number;
  text: string;
  language: string;
};
