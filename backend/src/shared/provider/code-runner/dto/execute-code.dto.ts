import { ApiProperty } from '@nestjs/swagger';

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

  constructor(
    output: string,
    errOutput: string,
    timeMs: number,
    errorOcurred: boolean,
    memoryUsage: number,
  ) {
    this.output = output;
    this.errOutput = errOutput;
    this.timeMs = timeMs;
    this.errorOcurred = errorOcurred;
    this.memoryUsage = memoryUsage;
  }
}
