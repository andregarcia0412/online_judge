import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SubmissionStatusEnum } from '../enum/submission-status';

@Entity('Submission')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @Column({ name: 'id_problem', type: 'integer' })
  idProblem: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 64 })
  language: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatusEnum,
    default: SubmissionStatusEnum.PENDING,
  })
  status: SubmissionStatusEnum;

  @Column({ name: 'execution_time', type: 'integer' })
  executionTime: number;

  @Column({
    name: 'submission_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  submissionDate: Date;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @Column({ name: 'memory_usage_MB', type: 'decimal', precision: 10, scale: 2 })
  memoryUsageMB: number;

  @Column({ name: 'test_cases_passed', type: 'integer' })
  testCasesPassed: number;

  constructor(
    id: string,
    idUser: string,
    idProblem: number,
    text: string,
    language: string,
    status: SubmissionStatusEnum,
    executionTime: number,
    submissionDate: Date,
    error: string | null,
    memoryUsageMB: number,
    testCasesPassed: number,
  ) {
    this.id = id;
    this.idUser = idUser;
    this.idProblem = idProblem;
    this.text = text;
    this.language = language;
    this.status = status;
    this.executionTime = executionTime;
    this.submissionDate = submissionDate;
    this.error = error;
    this.memoryUsageMB = memoryUsageMB;
    this.testCasesPassed = testCasesPassed;
  }
}
