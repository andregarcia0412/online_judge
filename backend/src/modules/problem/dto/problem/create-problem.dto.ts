import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
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

  @Expose({ name: 'input_description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty({ name: 'input_description' })
  inputDescription: string;

  @Expose({ name: 'output_description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty({ name: 'output_description' })
  outputDescription: string;

  @Expose({ name: 'input_example' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty({ name: 'input_example' })
  inputExample: string;

  @Expose({ name: 'output_example' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty({ name: 'output_example' })
  outputExample: string;

  @IsEnum(ProblemDifficultyEnum)
  @ApiProperty({ enum: ProblemDifficultyEnum })
  difficulty: ProblemDifficultyEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  @ApiProperty({ type: [CreateCategoryDto] })
  category: CreateCategoryDto[];

  @Expose({ name: 'test_cases' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestCaseDto)
  @ApiProperty({ name: 'test_cases', type: [CreateTestCaseDto] })
  testCases: CreateTestCaseDto[];

  constructor(
    title: string,
    points: number,
    author: string,
    description: string,
    inputDescription: string,
    outputDescription: string,
    inputExample: string,
    outputExample: string,
    difficulty: ProblemDifficultyEnum,
    category: CreateCategoryDto[],
    testCases: CreateTestCaseDto[],
  ) {
    this.title = title;
    this.points = points;
    this.author = author;
    this.description = description;
    this.inputDescription = inputDescription;
    this.outputDescription = outputDescription;
    this.inputExample = inputExample;
    this.outputExample = outputExample;
    this.difficulty = difficulty;
    this.category = category;
    this.testCases = testCases;
  }
}
