import { ApiProperty } from '@nestjs/swagger';
import { Problem } from '../entities/problem.entity';

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

  @ApiProperty()
  input_description: string;

  @ApiProperty()
  output_description: string;

  @ApiProperty()
  input_example: string;

  @ApiProperty()
  output_example: string;

  @ApiProperty()
  creation_date: Date;

  constructor(
    id: number,
    title: string,
    points: number,
    author: string,
    description: string,
    input_description: string,
    output_description: string,
    input_example: string,
    output_example: string,
    creation_date: Date,
  ) {
    this.id = id;
    this.title = title;
    this.points = points;
    this.author = author;
    this.description = description;
    this.input_description = input_description;
    this.output_description = output_description;
    this.input_example = input_example;
    this.output_example = output_example;
    this.creation_date = creation_date;
  }

  static fromEntity(problem: Problem): ReturnProblemDto {
    return new ReturnProblemDto(
      problem.id,
      problem.title,
      problem.points,
      problem.author,
      problem.description,
      problem.input_description,
      problem.output_description,
      problem.input_example,
      problem.output_example,
      problem.creation_date,
    );
  }
}
