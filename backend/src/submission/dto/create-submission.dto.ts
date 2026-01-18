import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  id_user: string;

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
