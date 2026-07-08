import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from 'src/modules/submission/enum/submission-status';

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
  @ApiProperty({ enum: StatusEnum })
  status?: StatusEnum;

  constructor(
    output: string,
    errOutput: string,
    timeMs: number,
    errorOcurred: boolean,
    memoryUsage: number,
    status?: StatusEnum,
  ) {
    this.output = output;
    this.errOutput = errOutput;
    this.timeMs = timeMs;
    this.errorOcurred = errorOcurred;
    this.memoryUsage = memoryUsage;
    this.status = status;
  }
}
