import { Inject, Injectable } from '@nestjs/common';
import { TestCaseRepositoryPort } from '../../interface/test-case.repository.port';
import { DeleteResult } from 'typeorm';

@Injectable()
export class RemoveTestCaseUseCase {
  constructor(
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(id: string): Promise<DeleteResult> {
    return await this.testCaseRepository.delete(id);
  }
}
