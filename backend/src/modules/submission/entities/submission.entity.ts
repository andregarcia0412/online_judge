import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { StatusEnum } from '../enum/submission-status';

@Entity('Submission')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  id_user: string;

  @Column({ type: 'integer' })
  id_problem: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'text' })
  language: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.PENDING })
  status: StatusEnum;

  @Column({ type: 'integer' })
  execution_time: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submission_date: Date;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  memory_usage_MB: number;

  @Column({ type: 'integer' })
  test_cases_passed: number;

  constructor(
    id: string,
    id_user: string,
    id_problem: number,
    text: string,
    language: string,
    status: StatusEnum,
    execution_time: number,
    submission_date: Date,
    error: string | null,
    memory_usage_MB: number,
    test_cases_passed: number,
  ) {
    this.id = id;
    this.id_user = id_user;
    this.id_problem = id_problem;
    this.text = text;
    this.language = language;
    this.status = status;
    this.execution_time = execution_time;
    this.submission_date = submission_date;
    this.error = error;
    this.memory_usage_MB = memory_usage_MB;
    this.test_cases_passed = test_cases_passed;
  }
}
