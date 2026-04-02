import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ProblemDifficultyEnum } from '../enum/problem-difficulty.enum';

@Entity('Problem')
export class Problem {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'text', unique: true })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  points: number;

  @Column({ type: 'text' })
  author: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  input_description: string;

  @Column({ type: 'text' })
  output_description: string;

  @Column({ type: 'text', nullable: true })
  input_example: string;

  @Column({ type: 'text', nullable: true })
  output_example: string;

  @Column({ type: 'integer', default: 0 })
  total_submitted: number;

  @Column({ type: 'integer', default: 0 })
  total_accepted: number;

  @Column({ type: 'enum', enum: ProblemDifficultyEnum })
  difficulty: ProblemDifficultyEnum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date;

  constructor(
    id: number,
    title: string,
    points: number,
    author: string,
    description: string,
    input_description: string,
    output_description: string,
    input_example: string,
    output_example: string,
    total_submitted: number,
    total_accepted: number,
    difficulty: ProblemDifficultyEnum,
    creation_date: Date,
  ) {
    this.id = id;
    this.title = title;
    this.points = points;
    this.author = author;
    this.description = description;
    this.input_description = input_description;
    this.output_description = output_description;
    this.input_example = input_example;
    this.output_example = output_example;
    this.total_submitted = total_submitted;
    this.total_accepted = total_accepted;
    this.difficulty = difficulty;
    this.creation_date = creation_date;
  }
}
