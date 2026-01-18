export class ReturnUserDto {
  constructor(
    id_user: string,
    email: string,
    username: string,
    points: number,
    total_submissions: number,
    total_resolved: number,
    streak: number,
    creation_date: Date,
  ) {
    this.id_user = id_user;
    this.email = email;
    this.username = username;
    this.points = points;
    this.total_submissions = total_submissions;
    this.total_resolved = total_resolved;
    this.streak = streak;
    this.creation_date = creation_date;
  }

  id_user: string;

  email: string;

  username: string;

  points: number;

  total_submissions: number;

  total_resolved: number;

  streak: number;

  creation_date: Date;
}
