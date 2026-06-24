import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Problem } from 'src/modules/problem/entities/problem.entity';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { ProblemRepositoryPort } from 'src/modules/problem/interface/repository/problem.repository.port';
import { TestCaseRepositoryPort } from 'src/modules/problem/interface/repository/test-case.repository.port';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { TestRunnerServicePort } from 'src/modules/test-runner/interface/test-runner.service.port';
import { EntityManager } from 'typeorm';
import { CreateSubmissionDto } from '../dto/create-submission.dto';

@Injectable()
export class CreatePlaygroundSubmissionUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
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

  private async getProblemOrThrow(
    id: number,
    manager?: EntityManager,
  ): Promise<Problem> {
    const problem = await this.problemRepository.findById(id, manager);
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return problem;
  }

  private async getTestCasesOrThrow(
    idProblem: number,
    manager?: EntityManager,
  ): Promise<TestCase[]> {
    const testCases = await this.testCaseRepository.findByProblemId(
      idProblem,
      manager,
    );

    if (!testCases || testCases.length === 0) {
      throw new NotFoundException('There are no test cases for this problem');
    }

    return testCases;
  }
}
