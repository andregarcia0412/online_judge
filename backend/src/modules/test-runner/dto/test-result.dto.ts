import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SubmissionStatusEnum } from 'src/modules/submission/enum/submission-status';

export class TestResult {
  constructor(
    status: SubmissionStatusEnum,
    executionTime: number,
    stdout: string | null,
    error: string | null,
    memoryUsageMB: number,
    testCasesPassed: number,
  ) {
    this.status = status;
    this.executionTime = executionTime;
    this.stdout = stdout;
    this.error = error;
    this.memoryUsageMB = memoryUsageMB;
    this.testCasesPassed = testCasesPassed;
  }

  @ApiProperty()
  status: SubmissionStatusEnum;

  @Expose({ name: 'execution_time' })
  @ApiProperty({ name: 'execution_time' })
  executionTime: number;

  @ApiProperty()
  stdout: string | null;

  @ApiProperty()
  error: string | null;

  @Expose({ name: 'memory_usage_MB' })
  @ApiProperty({ name: 'memory_usage_MB' })
  memoryUsageMB: number;

  @Expose({ name: 'test_cases_passed' })
  @ApiProperty({ name: 'test_cases_passed' })
  testCasesPassed: number;
}
