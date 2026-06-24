import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProblemDifficultyEnum } from '../enum/problem-difficulty.enum';
import { Category } from './category.entity';
import { TestCase } from './test-case.entity';

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

  @Column({ name: 'input_description', type: 'text' })
  inputDescription!: string;

  @Column({ name: 'output_description', type: 'text' })
  outputDescription!: string;

  @Column({ name: 'input_example', type: 'text', nullable: true })
  inputExample!: string;

  @Column({ name: 'output_example', type: 'text', nullable: true })
  outputExample!: string;

  @Column({ name: 'total_submitted', type: 'integer', default: 0 })
  totalSubmitted!: number;

  @Column({ name: 'total_accepted', type: 'integer', default: 0 })
  totalAccepted!: number;

  @Column({ type: 'enum', enum: ProblemDifficultyEnum })
  difficulty!: ProblemDifficultyEnum;

  @OneToMany(() => TestCase, (testCase) => testCase.problem, {
    cascade: true,
    eager: true,
  })
  testCases!: TestCase[];

  @OneToMany(() => Category, (category) => category.problem, {
    cascade: true,
    eager: true,
  })
  categories!: Category[];

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
