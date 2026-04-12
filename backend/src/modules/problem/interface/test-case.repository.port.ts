import { EntityManager, UpdateResult } from 'typeorm';
import { CreateTestCaseDto } from '../dto/test-case/create-test-case.dto';
import { UpdateTestCaseDto } from '../dto/test-case/update-test-case.dto';
import { TestCase } from '../entities/test-case.entity';
import { DeleteResult } from 'typeorm';

export interface TestCaseRepositoryPort {
  createAndSave(
    createTestCaseDto: CreateTestCaseDto,
    manager?: EntityManager,
  ): Promise<TestCase>;
  createAndSaveMany(
    createTestCaseDtos: CreateTestCaseDto[],
    manager?: EntityManager,
  ): Promise<TestCase[]>;
  findAll(manager?: EntityManager): Promise<TestCase[]>;
  findOneById(id: string, manager?: EntityManager): Promise<TestCase | null>;
  findByProblemId(
    id_problem: number,
    manager?: EntityManager,
  ): Promise<TestCase[]>;
  updateById(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
    manager?: EntityManager,
  ): Promise<UpdateResult>;
  delete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  deleteByProblemId(
    id_problem: number,
    manager?: EntityManager,
  ): Promise<DeleteResult>;
}

export const TestCaseRepositoryPort = Symbol('TestCaseRepository');
