import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTestCaseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id_problem: number;

  @IsString()
  @ApiProperty()
  input: string;

  @IsString()
  @ApiProperty()
  output: string;

  constructor(id_problem: number, input: string, output: string) {
    this.id_problem = id_problem;
    this.input = input;
    this.output = output;
  }
}
