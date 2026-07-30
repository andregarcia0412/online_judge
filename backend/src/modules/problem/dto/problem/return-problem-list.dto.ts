import { ApiProperty } from '@nestjs/swagger';
import { ReturnProblemDto } from './return-problem.dto';
import { Problem } from '../../entities/problem.entity';
import { Expose } from 'class-transformer';

export class ReturnProblemListDto {
  @ApiProperty({ type: [ReturnProblemDto] })
  problems: ReturnProblemDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @Expose({ name: 'total_pages' })
  @ApiProperty({ name: 'total_pages' })
  totalPages: number;

  constructor(
    problems: ReturnProblemDto[],
    page: number,
    limit: number,
    totalPages: number,
  ) {
    this.problems = problems;
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
  }

  static fromEntity(
    problems: Problem[],
    page: number,
    limit: number,
    totalPages: number,
  ) {
    return new ReturnProblemListDto(
      problems.map((problem) => ReturnProblemDto.fromEntity(problem)),
      page,
      limit,
      totalPages,
    );
  }
}
