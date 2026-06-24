import { ApiProperty } from '@nestjs/swagger';
import { TestCase } from '../../entities/test-case.entity';

export class ReturnTestCaseDto {
  @ApiProperty()
  id: string;

  @Expose({ name: 'id_problem' })
  @ApiProperty({ name: 'id_problem' })
  idProblem: number;

  @ApiProperty()
  input: string;

  @ApiProperty()
  output: string;

  constructor(id: string, idProblem: number, input: string, output: string) {
    this.id = id;
    this.idProblem = idProblem;
    this.input = input;
    this.output = output;
  }

  static fromEntity(testCase: TestCase): ReturnTestCaseDto {
    return new ReturnTestCaseDto(
      testCase.id,
      testCase.idProblem,
      testCase.input,
      testCase.output,
    );
  }

  static fromEntityList(testCases: TestCase[]): ReturnTestCaseDto[] {
    return testCases.map((testCase) => ReturnTestCaseDto.fromEntity(testCase));
  }
}
