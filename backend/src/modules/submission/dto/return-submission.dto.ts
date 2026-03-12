import { ApiProperty } from '@nestjs/swagger';
import { Submission } from '../entities/submission.entity';

export class ReturnSubmissionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_user: string;

  @ApiProperty()
  id_problem: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  execution_time: number;

  @ApiProperty()
  submission_date: Date;

  @ApiProperty()
  error: string | null;

  @ApiProperty()
  last_stdout: string | null;

  @ApiProperty()
  memoryUsageMB: number;

  constructor(
    id: string,
    id_user: string,
    id_problem: number,
    text: string,
    language: string,
    status: string,
    execution_time: number,
    submission_date: Date,
    error: string | null,
    last_stdout: string | null,
    memoryUsageMB: number,
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
    this.last_stdout = last_stdout;
    this.memoryUsageMB = memoryUsageMB;
  }

  static fromEntity(submission: Submission): ReturnSubmissionDto {
    return new ReturnSubmissionDto(
      submission.id,
      submission.id_user,
      submission.id_problem,
      submission.text,
      submission.language,
      submission.status,
      submission.execution_time,
      submission.submission_date,
      submission.error,
      null,
      submission.memoryUsageMB,
    );
  }
}
