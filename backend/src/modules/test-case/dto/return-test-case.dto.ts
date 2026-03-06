import { ApiProperty } from '@nestjs/swagger';
import { TestCase } from '../entities/test-case.entity';

export class ReturnTestCaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_problem: number;

  @ApiProperty()
  input: string;

  @ApiProperty()
  output: string;

  constructor(id: string, id_problem: number, input: string, output: string) {
    this.id = id;
    this.id_problem = id_problem;
    this.input = input;
    this.output = output;
  }

  static fromEntity(testCase: TestCase): ReturnTestCaseDto {
    return new ReturnTestCaseDto(
      testCase.id,
      testCase.id_problem,
      testCase.input,
      testCase.output,
    );
  }
}
