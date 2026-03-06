import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCase } from './entities/test-case.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ProblemService } from 'src/modules/problem/problem.service';
import { ReturnTestCaseDto } from './dto/return-test-case.dto';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class TestCaseService {
  constructor(
    @InjectRepository(TestCase)
    private testCaseRepository: Repository<TestCase>,
    private problemService: ProblemService,
  ) {}

  async create(
    createTestCaseDto: CreateTestCaseDto,
  ): Promise<ReturnTestCaseDto> {
    if (
      !(await this.problemService.findOneById(createTestCaseDto.id_problem))
    ) {
      throw new NotFoundException('Problem not found');
    }

    const newTestCase = this.testCaseRepository.create(createTestCaseDto);
    return ReturnTestCaseDto.fromEntity(
      await this.testCaseRepository.save(newTestCase),
    );
  }

  async findAll(): Promise<ReturnTestCaseDto[]> {
    return await this.testCaseRepository.find();
  }

  async findOneById(id: string): Promise<ReturnTestCaseDto> {
    const testCase = await this.testCaseRepository.findOneBy({ id });
    if (!testCase) {
      throw new NotFoundException('Test case not found');
    }

    return ReturnTestCaseDto.fromEntity(testCase);
  }

  async findAllByProblemId(id_problem: number): Promise<ReturnTestCaseDto[]> {
    return (await this.testCaseRepository.findBy({ id_problem })).map(
      (testCase: TestCase) => ReturnTestCaseDto.fromEntity(testCase),
    );
  }

  async update(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<UpdateResult> {
    return await this.testCaseRepository.update(id, updateTestCaseDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.testCaseRepository.delete(id);
  }
}
