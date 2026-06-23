import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProblemDifficultyEnum } from '../enum/problem-difficulty.enum';
import { TestCase } from './test-case.entity';
import { Category } from './category.entity';

@Entity('Problem')
export class Problem {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'text', unique: true })
  title!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  points!: number;

  @Column({ type: 'text' })
  author!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  input_description!: string;

  @Column({ type: 'text' })
  output_description!: string;

  @Column({ type: 'text', nullable: true })
  input_example!: string;

  @Column({ type: 'text', nullable: true })
  output_example!: string;

  @Column({ type: 'integer', default: 0 })
  total_submitted!: number;

  @Column({ type: 'integer', default: 0 })
  total_accepted!: number;

  @Column({ type: 'enum', enum: ProblemDifficultyEnum })
  difficulty!: ProblemDifficultyEnum;

  @OneToMany(() => TestCase, (testCase) => testCase.problem, {
    cascade: true,
  })
  testCases!: TestCase[];

  @OneToMany(() => Category, (category) => category.problem, {
    cascade: true,
  })
  categories!: Category[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creation_date!: Date;
}
