import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateTestCaseDto } from '../dto/test-case/create-test-case.dto';
import { ReturnTestCaseDto } from '../dto/test-case/return-test-case.dto';
import { UpdateTestCaseDto } from '../dto/test-case/update-test-case.dto';
import { ProblemRepositoryPort } from '../interface/problem.repository.port';
import { TestCaseRepositoryPort } from '../interface/test-case.repository.port';

@Injectable()
export class TestCaseService {
  constructor(
    @Inject(TestCaseRepositoryPort)
    private testCaseRepository: TestCaseRepositoryPort,
    @Inject(ProblemRepositoryPort)
    private problemRepository: ProblemRepositoryPort,
  ) {}

  async create(
    createTestCaseDto: CreateTestCaseDto,
  ): Promise<ReturnTestCaseDto> {
    if (!createTestCaseDto.id_problem) {
      throw new BadRequestException('Problem Id is missing');
    }
    if (
      !(await this.problemRepository.findById(createTestCaseDto.id_problem))
    ) {
      throw new NotFoundException('Problem not found');
    }

    return ReturnTestCaseDto.fromEntity(
      await this.testCaseRepository.createAndSave(createTestCaseDto),
    );
  }

  async findAll(): Promise<ReturnTestCaseDto[]> {
    return ReturnTestCaseDto.fromEntityList(
      await this.testCaseRepository.findAll(),
    );
  }

  async findOneById(id: string): Promise<ReturnTestCaseDto> {
    const testCase = await this.testCaseRepository.findOneById(id);
    if (!testCase) {
      throw new NotFoundException('Test case not found');
    }

    return ReturnTestCaseDto.fromEntity(testCase);
  }

  async findAllByProblemId(id_problem: number): Promise<ReturnTestCaseDto[]> {
    return ReturnTestCaseDto.fromEntityList(
      await this.testCaseRepository.findByProblemId(id_problem),
    );
  }

  async update(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<UpdateResult> {
    return await this.testCaseRepository.updateById(id, updateTestCaseDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.testCaseRepository.delete(id);
  }
}
