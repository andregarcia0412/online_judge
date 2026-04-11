import { UpdateResult } from 'typeorm';
import { CreateTestCaseDto } from '../dto/test-case/create-test-case.dto';
import { UpdateTestCaseDto } from '../dto/test-case/update-test-case.dto';
import { TestCase } from '../entities/test-case.entity';
import { DeleteResult } from 'typeorm';

export interface TestCaseRepositoryPort {
  createAndSave(createTestCaseDto: CreateTestCaseDto): Promise<TestCase>;
  findAll(): Promise<TestCase[]>;
  findOneById(id: string): Promise<TestCase | null>;
  findByProblemId(id_problem: number): Promise<TestCase[]>;
  updateById(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<UpdateResult>;
  delete(id: string): Promise<DeleteResult>;
  deleteByProblemId(id_problem: number): Promise<DeleteResult>;
}

export const TestCaseRepositoryPort = Symbol('TestCaseRepository');
