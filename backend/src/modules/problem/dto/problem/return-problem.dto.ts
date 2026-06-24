import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Problem } from '../../entities/problem.entity';
import { ReturnCategoryDto } from '../category/return-category.dto';
import { ReturnTestCaseDto } from '../test-case/return-test-case.dto';

export class ReturnProblemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  description: string;

  @Expose({ name: 'input_description' })
  @ApiProperty({ name: 'input_description' })
  inputDescription: string;

  @Expose({ name: 'output_description' })
  @ApiProperty({ name: 'output_description' })
  outputDescription: string;

  @Expose({ name: 'input_example' })
  @ApiProperty({ name: 'input_example' })
  inputExample: string;

  @Expose({ name: 'output_example' })
  @ApiProperty({ name: 'output_example' })
  outputExample: string;

  @Expose({ name: 'total_submitted' })
  @ApiProperty({ name: 'total_submitted' })
  totalSubmitted: number;

  @Expose({ name: 'total_accepted' })
  @ApiProperty({ name: 'total_accepted' })
  totalAccepted: number;

  @ApiProperty()
  difficulty: string;

  @ApiProperty({ type: [ReturnCategoryDto] })
  categories: ReturnCategoryDto[];

  @Expose({ name: 'test_cases' })
  @ApiProperty({ name: 'test_cases', type: [ReturnTestCaseDto] })
  testCases: ReturnTestCaseDto[];

  @Expose({ name: 'created_at' })
  @ApiProperty({ name: 'created_at' })
  createdAt: Date;

  constructor(
    id: number,
    title: string,
    points: number,
    author: string,
    description: string,
    inputDescription: string,
    outputDescription: string,
    inputExample: string,
    outputExample: string,
    totalSubmitted: number,
    totalAccepted: number,
    difficulty: string,
    createdAt: Date,
    categories?: ReturnCategoryDto[],
    testCases?: ReturnTestCaseDto[],
  ) {
    this.id = id;
    this.title = title;
    this.points = points;
    this.author = author;
    this.description = description;
    this.inputDescription = inputDescription;
    this.outputDescription = outputDescription;
    this.inputExample = inputExample;
    this.outputExample = outputExample;
    this.totalSubmitted = totalSubmitted;
    this.totalAccepted = totalAccepted;
    this.difficulty = difficulty;
    this.createdAt = createdAt;
    this.categories = categories ?? [];
    this.testCases = testCases ?? [];
  }

  static fromEntity(problem: Problem): ReturnProblemDto {
    return new ReturnProblemDto(
      problem.id,
      problem.title,
      problem.points,
      problem.author,
      problem.description,
      problem.inputDescription,
      problem.outputDescription,
      problem.inputExample,
      problem.outputExample,
      problem.totalSubmitted,
      problem.totalAccepted,
      problem.difficulty,
      problem.createdAt,
      ReturnCategoryDto.fromEntityList(problem.categories ?? []),
      ReturnTestCaseDto.fromEntityList(problem.testCases ?? []),
    );
  }
}
