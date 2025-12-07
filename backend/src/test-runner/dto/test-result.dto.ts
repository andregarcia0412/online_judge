export class TestResult {
  constructor(status: string, execution_time: number, error: string | null) {
    this.status = status;
    this.execution_time = execution_time;
    this.error = error;
  }

  status: string;

  execution_time: number;

  error: string | null;
}
