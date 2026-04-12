import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTestCaseDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  id_problem?: number;

  @IsString()
  @ApiProperty()
  input: string;

  @IsString()
  @ApiProperty()
  output: string;

  constructor(input: string, output: string, id_problem?: number) {
    this.id_problem = id_problem;
    this.input = input;
    this.output = output;
  }
}
