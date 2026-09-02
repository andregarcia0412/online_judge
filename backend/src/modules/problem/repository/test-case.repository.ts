import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TestCase } from '../entities/test-case.entity';
import { TestCaseRepositoryPort } from '../interface/repository/test-case.repository.port';

@Injectable()
export class TestCaseRepository implements TestCaseRepositoryPort {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}
  async findByProblemId(idProblem: number): Promise<TestCase[]> {
    return await this.testCaseRepository.findBy({ idProblem });
  }
  async createAndSave(createTestCase: Partial<TestCase>): Promise<TestCase> {
    const createdTestCase = this.testCaseRepository.create(createTestCase);
    return await this.testCaseRepository.save(createdTestCase);
  }
  async createAndSaveMany(
    createTestCases: Partial<TestCase>[],
  ): Promise<TestCase[]> {
    const createdTestCases = this.testCaseRepository.create(createTestCases);
    return await this.testCaseRepository.save(createdTestCases);
  }
  async findAll(): Promise<TestCase[]> {
    return await this.testCaseRepository.find();
  }
  async findOneById(id: string): Promise<TestCase | null> {
    return await this.testCaseRepository.findOneBy({ id });
  }
  async updateById(
    id: string,
    updateTestCase: Partial<TestCase>,
  ): Promise<TestCase | null> {
    const testCase = await this.testCaseRepository.findOneBy({ id });

    if (!testCase) {
      return null;
    }

    const merged = this.testCaseRepository.merge(testCase, updateTestCase);
    return await this.testCaseRepository.save(merged);
  }
  async delete(id: string): Promise<void> {
    await this.testCaseRepository.delete(id);
  }
  async deleteByProblemId(idProblem: number): Promise<void> {
    await this.testCaseRepository.delete({ idProblem });
  }
  private get testCaseRepository(): Repository<TestCase> {
    return this.txHost.tx.getRepository(TestCase);
  }
}
