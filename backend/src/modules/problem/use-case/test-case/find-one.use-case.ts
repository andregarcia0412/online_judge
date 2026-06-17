import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TestCaseRepositoryPort } from '../../interface/test-case.repository.port';
import { TestCase } from '../../entities/test-case.entity';

@Injectable()
export class FindTestCaseByIdUseCase {
  constructor(
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(id: string): Promise<TestCase> {
    const testCase = await this.testCaseRepository.findOneById(id);

    if (!testCase) {
      throw new NotFoundException('Test case not found');
    }

    return testCase;
  }
}
