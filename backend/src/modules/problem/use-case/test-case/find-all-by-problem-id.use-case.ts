import { Inject, Injectable } from '@nestjs/common';
import { TestCaseRepositoryPort } from '../../interface/repository/test-case.repository.port';
import { TestCase } from '../../entities/test-case.entity';

@Injectable()
export class FindAllTestCasesByProblemIdUseCase {
  constructor(
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(problemId: number): Promise<TestCase[]> {
    return await this.testCaseRepository.findByProblemId(problemId);
  }
}
