import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTestCaseDto {
  @IsNumber()
  @IsNotEmpty()
  id_problem: number;

  @IsString()
  input: string;

  @IsString()
  output: string;
}
