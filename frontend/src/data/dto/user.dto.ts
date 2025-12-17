export type User = {
  id_user: string;
  email: string;
  username: string;
  password: string;
  points: number;
  total_submissions: number;
  total_resolved: number;
  streak: number;
  creation_date: Date;
};