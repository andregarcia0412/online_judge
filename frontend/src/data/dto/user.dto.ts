export type User = {
  id: string;
  email: string;
  username: string;
  password: string;
  points: number;
  total_submissions: number;
  total_resolved: number;
  streak: number;
  creation_date: Date;
};
