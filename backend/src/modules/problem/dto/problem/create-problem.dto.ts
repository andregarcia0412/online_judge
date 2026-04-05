import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProblemDifficultyEnum } from '../../enum/problem-difficulty.enum';
import { Type } from 'class-transformer';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @ApiProperty()
  title: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  points: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @ApiProperty()
  author: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty()
  input_description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty()
  output_description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty()
  input_example: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty()
  output_example: string;

  @IsEnum(ProblemDifficultyEnum)
  @ApiProperty({ enum: ProblemDifficultyEnum })
  difficulty: ProblemDifficultyEnum;

  constructor(
    title: string,
    points: number,
    author: string,
    description: string,
    input_description: string,
    output_description: string,
    input_example: string,
    output_example: string,
    difficulty: ProblemDifficultyEnum,
  ) {
    this.title = title;
    this.points = points;
    this.author = author;
    this.description = description;
    this.input_description = input_description;
    this.output_description = output_description;
    this.input_example = input_example;
    this.output_example = output_example;
    this.difficulty = difficulty;
  }
}
