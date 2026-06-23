import { Inject, Injectable } from '@nestjs/common';
import { TestCaseRepositoryPort } from '../../interface/repository/test-case.repository.port';

@Injectable()
export class RemoveTestCaseUseCase {
  constructor(
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    await this.testCaseRepository.delete(id);
  }
}
