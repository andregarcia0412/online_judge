import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Problem } from 'src/modules/problem/entities/problem.entity';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { ProblemServicePort } from 'src/modules/problem/interface/service/problem.service.port';
import { TestCaseServicePort } from 'src/modules/problem/interface/service/test-case.service.port';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { TestRunnerServicePort } from 'src/modules/test-runner/interface/test-runner.service.port';
import { CreateSubmissionDto } from '../dto/create-submission.dto';

@Injectable()
export class CreatePlaygroundSubmissionUseCase {
  constructor(
    @Inject(ProblemServicePort)
    private readonly problemService: ProblemServicePort,
    @Inject(TestCaseServicePort)
    private readonly testCaseService: TestCaseServicePort,
    @Inject(TestRunnerServicePort)
    private readonly testRunnerService: TestRunnerServicePort,
  ) {}

  async execute(createSubmissionDto: CreateSubmissionDto): Promise<TestResult> {
    await this.getProblemOrThrow(createSubmissionDto.idProblem);

    const testCases = await this.getTestCasesOrThrow(
      createSubmissionDto.idProblem,
    );

    const testResults = await this.testRunnerService.runTests(
      testCases,
      createSubmissionDto.text,
      createSubmissionDto.language,
    );

    return testResults;
  }

  private async getProblemOrThrow(id: number): Promise<Problem> {
    return await this.problemService.findProblemEntityById(id);
  }

  private async getTestCasesOrThrow(idProblem: number): Promise<TestCase[]> {
    const testCases =
      await this.testCaseService.findAllEntitiesByProblemId(idProblem);

    if (!testCases || testCases.length === 0) {
      throw new NotFoundException('There are no test cases for this problem');
    }

    return testCases;
  }
}
