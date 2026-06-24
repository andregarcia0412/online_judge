import { ApiProperty } from '@nestjs/swagger';
import { Submission } from '../entities/submission.entity';
import { Expose } from 'class-transformer';

export class ReturnSubmissionDto {
  @ApiProperty()
  id: string;

  @Expose({ name: 'id_user' })
  @ApiProperty({ name: 'id_user' })
  idUser: string;

  @Expose({ name: 'id_problem' })
  @ApiProperty({ name: 'id_problem' })
  idProblem: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  status: string;

  @Expose({ name: 'execution_time' })
  @ApiProperty({ name: 'execution_time' })
  executionTime: number;

  @Expose({ name: 'submission_date' })
  @ApiProperty({ name: 'submission_date' })
  submissionDate: Date;

  @ApiProperty()
  error: string | null;

  @Expose({ name: 'last_stdout' })
  @ApiProperty({ name: 'last_stdout' })
  lastStdout: string | null;

  @Expose({ name: 'memory_usage_MB' })
  @ApiProperty({ name: 'memory_usage_MB' })
  memoryUsageMB: number;

  @Expose({ name: 'test_cases_passed' })
  @ApiProperty({ name: 'test_cases_passed' })
  testCasesPassed: number;

  constructor(
    id: string,
    idUser: string,
    idProblem: number,
    text: string,
    language: string,
    status: string,
    executionTime: number,
    submissionDate: Date,
    error: string | null,
    lastStdout: string | null,
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
    this.lastStdout = lastStdout;
    this.memoryUsageMB = memoryUsageMB;
    this.testCasesPassed = testCasesPassed;
  }

  static fromEntity(submission: Submission): ReturnSubmissionDto {
    return new ReturnSubmissionDto(
      submission.id,
      submission.idUser,
      submission.idProblem,
      submission.text,
      submission.language,
      submission.status,
      submission.executionTime,
      submission.submissionDate,
      submission.error,
      null,
      submission.memoryUsageMB,
      submission.testCasesPassed,
    );
  }
}
