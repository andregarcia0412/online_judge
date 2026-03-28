import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  @ApiProperty()
  id_user: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  id_problem: number;

  @IsString()
  @ApiProperty()
  text: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  language: string;

  constructor(
    id_user: string,
    id_problem: number,
    text: string,
    language: string,
  ) {
    this.id_user = id_user;
    this.id_problem = id_problem;
    this.text = text;
    this.language = language;
  }
}
