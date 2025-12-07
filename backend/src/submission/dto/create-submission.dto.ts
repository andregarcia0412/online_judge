import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateSubmissionDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  id_user: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  id_problem: number;

  @IsString()
  text: string;

  @IsString()
  @IsNotEmpty()
  language: string;
}
