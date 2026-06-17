import { Inject, Injectable } from '@nestjs/common';
import { TestCaseRepositoryPort } from '../../interface/test-case.repository.port';
import { UpdateResult } from 'typeorm';
import { UpdateTestCaseDto } from '../../dto/test-case/update-test-case.dto';

@Injectable()
export class UpdateTestCaseUseCase {
  constructor(
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<UpdateResult> {
    return await this.testCaseRepository.updateById(id, updateTestCaseDto);
  }
}
