import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  points: number;

  @Column({ type: 'integer', default: 0 })
  total_submissions: number;

  @Column({ type: 'integer', default: 0 })
  total_resolved: number;

  @Column({ type: 'integer', default: 0 })
  streak: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date;

  constructor(
    id: string,
    email: string,
    username: string,
    password: string,
    points: number,
    total_submissions: number,
    total_resolved: number,
    streak: number,
    creation_date: Date,
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.points = points;
    this.total_submissions = total_submissions;
    this.total_resolved = total_resolved;
    this.streak = streak;
    this.creation_date = creation_date;
  }
}
