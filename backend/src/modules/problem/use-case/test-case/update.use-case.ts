import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTestCaseDto } from '../../dto/test-case/update-test-case.dto';
import { TestCase } from '../../entities/test-case.entity';
import { TestCaseRepositoryPort } from '../../interface/repository/test-case.repository.port';

@Injectable()
export class UpdateTestCaseUseCase {
  constructor(
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<TestCase> {
    const testCase = await this.testCaseRepository.updateById(
      id,
      updateTestCaseDto,
    );

    if (!testCase) {
      throw new NotFoundException('Test case not found');
    }

    return testCase;
  }
}
