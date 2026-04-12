import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { ProblemDifficultyEnum } from '../../enum/problem-difficulty.enum';
import { CreateCategoryDto } from '../category/create-category.dto';
import { CreateTestCaseDto } from '../test-case/create-test-case.dto';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  @ApiProperty({ type: [CreateCategoryDto] })
  category: CreateCategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestCaseDto)
  @ApiProperty({ type: [CreateTestCaseDto] })
  test_cases: CreateTestCaseDto[];

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
    category: CreateCategoryDto[],
    test_cases: CreateTestCaseDto[],
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
    this.category = category;
    this.test_cases = test_cases;
  }
}
