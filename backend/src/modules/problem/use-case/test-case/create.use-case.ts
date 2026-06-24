import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TestCaseRepositoryPort } from '../../interface/repository/test-case.repository.port';
import { CreateTestCaseDto } from '../../dto/test-case/create-test-case.dto';
import { TestCase } from '../../entities/test-case.entity';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';

@Injectable()
export class CreateTestCaseUseCase {
  constructor(
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async execute(createTestCaseDto: CreateTestCaseDto): Promise<TestCase> {
    if (!createTestCaseDto.idProblem) {
      throw new BadRequestException('Problem Id is missing');
    }
    if (!(await this.problemRepository.findById(createTestCaseDto.idProblem))) {
      throw new NotFoundException('Problem not found');
    }

    return await this.testCaseRepository.createAndSave(createTestCaseDto);
  }
}
