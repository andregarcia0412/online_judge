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

  constructor(
    output: string,
    errOutput: string,
    timeMs: number,
    errorOcurred: boolean,
  ) {
    this.output = output;
    this.errOutput = errOutput;
    this.timeMs = timeMs;
    this.errorOcurred = errorOcurred;
  }
}
