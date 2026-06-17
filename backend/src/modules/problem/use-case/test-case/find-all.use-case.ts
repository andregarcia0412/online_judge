import { Inject, Injectable } from '@nestjs/common';
import { TestCaseRepositoryPort } from '../../interface/test-case.repository.port';
import { TestCase } from '../../entities/test-case.entity';

@Injectable()
export class FindAllTestCasesUseCase {
  constructor(
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(): Promise<TestCase[]> {
    return await this.testCaseRepository.findAll();
  }
}
