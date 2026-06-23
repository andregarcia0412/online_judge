import { EntityManager } from 'typeorm';
import { TestCase } from '../../entities/test-case.entity';

export interface TestCaseRepositoryPort {
  createAndSave(
    createTestCase: Partial<TestCase>,
    manager?: EntityManager,
  ): Promise<TestCase>;
  createAndSaveMany(
    createTestCases: Partial<TestCase>[],
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
    updateTestCase: Partial<TestCase>,
    manager?: EntityManager,
  ): Promise<TestCase | null>;
  delete(id: string, manager?: EntityManager): Promise<void>;
  deleteByProblemId(id_problem: number, manager?: EntityManager): Promise<void>;
}

export const TestCaseRepositoryPort = Symbol('TestCaseRepositoryPort');
