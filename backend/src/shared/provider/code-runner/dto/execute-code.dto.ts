import { ApiProperty } from '@nestjs/swagger';
import { SubmissionStatusEnum } from 'src/shared/enum/submission-status';

export class ExecuteCodeDto {
  @ApiProperty()
  output: string;
  @ApiProperty()
  errOutput: string;
  @ApiProperty()
  timeMs: number;
  @ApiProperty()
  errorOcurred: boolean;
  @ApiProperty()
  memoryUsage: number = 0;
  @ApiProperty({ enum: SubmissionStatusEnum })
  status?: SubmissionStatusEnum;

  constructor(
    output: string,
    errOutput: string,
    timeMs: number,
    errorOcurred: boolean,
    memoryUsage: number,
    status?: SubmissionStatusEnum,
  ) {
    this.output = output;
    this.errOutput = errOutput;
    this.timeMs = timeMs;
    this.errorOcurred = errorOcurred;
    this.memoryUsage = memoryUsage;
    this.status = status;
  }
}
