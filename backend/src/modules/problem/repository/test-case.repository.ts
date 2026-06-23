import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { TestCase } from '../entities/test-case.entity';
import { TestCaseRepositoryPort } from '../interface/repository/test-case.repository.port';

@Injectable()
export class TestCaseRepository implements TestCaseRepositoryPort {
  constructor(
    @InjectRepository(TestCase)
    private readonly testCaseRepository: Repository<TestCase>,
  ) {}
  async findByProblemId(
    id_problem: number,
    manager?: EntityManager,
  ): Promise<TestCase[]> {
    const repository = this.getRepository(manager);
    return await repository.findBy({ id_problem });
  }
  async createAndSave(
    createTestCase: Partial<TestCase>,
    manager?: EntityManager,
  ): Promise<TestCase> {
    const repository = this.getRepository(manager);
    const createdTestCase = repository.create(createTestCase);
    return await repository.save(createdTestCase);
  }
  async createAndSaveMany(
    createTestCases: Partial<TestCase>[],
    manager?: EntityManager,
  ): Promise<TestCase[]> {
    const repository = this.getRepository(manager);
    const createdTestCases = repository.create(createTestCases);
    return await repository.save(createdTestCases);
  }
  async findAll(manager?: EntityManager): Promise<TestCase[]> {
    const repository = this.getRepository(manager);
    return await repository.find();
  }
  async findOneById(
    id: string,
    manager?: EntityManager,
  ): Promise<TestCase | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ id });
  }
  async updateById(
    id: string,
    updateTestCase: Partial<TestCase>,
    manager?: EntityManager,
  ): Promise<TestCase | null> {
    const repository = this.getRepository(manager);
    const testCase = await repository.findOneBy({ id });

    if (!testCase) {
      return null;
    }

    const merged = repository.merge(testCase, updateTestCase);
    return await repository.save(merged);
  }
  async delete(id: string, manager?: EntityManager): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.delete(id);
  }
  async deleteByProblemId(
    id_problem: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.delete({ id_problem });
  }
  private getRepository(manager?: EntityManager): Repository<TestCase> {
    return manager ? manager.getRepository(TestCase) : this.testCaseRepository;
  }
}
