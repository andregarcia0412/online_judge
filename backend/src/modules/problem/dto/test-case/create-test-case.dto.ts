import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTestCaseDto {
  @Expose({ name: 'id_problem' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ name: 'id_problem', required: false })
  idProblem?: number;

  @IsString()
  @ApiProperty()
  input: string;

  @IsString()
  @ApiProperty()
  output: string;

  constructor(input: string, output: string, idProblem?: number) {
    this.idProblem = idProblem;
    this.input = input;
    this.output = output;
  }
}
