import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from 'src/modules/submission/enum/submission-status';

export class TestResult {
  constructor(
    status: StatusEnum,
    execution_time: number,
    stdout: string | null,
    error: string | null,
    memory_usage_MB: number,
    test_cases_passed: number,
  ) {
    this.status = status;
    this.execution_time = execution_time;
    this.stdout = stdout;
    this.error = error;
    this.memory_usage_MB = memory_usage_MB;
    this.test_cases_passed = test_cases_passed;
  }

  @ApiProperty()
  status: StatusEnum;

  @ApiProperty()
  execution_time: number;

  @ApiProperty()
  stdout: string | null;

  @ApiProperty()
  error: string | null;

  @ApiProperty()
  memory_usage_MB: number;

  @ApiProperty()
  test_cases_passed: number;
}
