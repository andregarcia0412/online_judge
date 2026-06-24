import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateSubmissionDto {
  @Expose({ name: 'id_problem' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @ApiProperty({ name: 'id_problem' })
  idProblem: number;

  @IsString()
  @ApiProperty()
  text: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  language: string;

  constructor(idProblem: number, text: string, language: string) {
    this.idProblem = idProblem;
    this.text = text;
    this.language = language;
  }
}
