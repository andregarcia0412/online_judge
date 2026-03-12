import { StatusEnum } from 'src/modules/submission/enum/submission-status';

export class TestResult {
  constructor(
    status: StatusEnum,
    execution_time: number,
    stdout: string | null,
    error: string | null,
    memoryUsageMB: number,
  ) {
    this.status = status;
    this.execution_time = execution_time;
    this.stdout = stdout;
    this.error = error;
    this.memoryUsageMB = memoryUsageMB;
  }

  status: StatusEnum;

  execution_time: number;

  stdout: string | null;

  error: string | null;

  memoryUsageMB: number;
}
