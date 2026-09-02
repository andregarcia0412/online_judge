import { TestCase } from '../../entities/test-case.entity';

export interface TestCaseRepositoryPort {
  createAndSave(createTestCase: Partial<TestCase>): Promise<TestCase>;
  createAndSaveMany(createTestCases: Partial<TestCase>[]): Promise<TestCase[]>;
  findAll(): Promise<TestCase[]>;
  findOneById(id: string): Promise<TestCase | null>;
  findByProblemId(id_problem: number): Promise<TestCase[]>;
  updateById(
    id: string,
    updateTestCase: Partial<TestCase>,
  ): Promise<TestCase | null>;
  delete(id: string): Promise<void>;
}

export const TestCaseRepositoryPort = Symbol('TestCaseRepositoryPort');
