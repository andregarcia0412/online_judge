import { StatusEnum } from 'src/modules/submission/enum/submission-status';

export class TestResult {
  constructor(
    status: StatusEnum,
    execution_time: number,
    stdout: string | null,
    error: string | null,
    memory_usage_MB: number,
  ) {
    this.status = status;
    this.execution_time = execution_time;
    this.stdout = stdout;
    this.error = error;
    this.memory_usage_MB = memory_usage_MB;
  }

  status: StatusEnum;

  execution_time: number;

  stdout: string | null;

  error: string | null;

  memory_usage_MB: number;
}
