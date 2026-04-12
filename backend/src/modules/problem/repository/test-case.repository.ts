import { Injectable } from '@nestjs/common';
import { TestCaseRepositoryPort } from '../interface/test-case.repository.port';
import { UpdateResult, DeleteResult, Repository, EntityManager } from 'typeorm';
import { CreateTestCaseDto } from '../dto/test-case/create-test-case.dto';
import { UpdateTestCaseDto } from '../dto/test-case/update-test-case.dto';
import { TestCase } from '../entities/test-case.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
    createTestCaseDto: CreateTestCaseDto,
    manager?: EntityManager,
  ): Promise<TestCase> {
    const repository = this.getRepository(manager);
    const createdTestCase = repository.create(createTestCaseDto);
    return await repository.save(createdTestCase);
  }
  async createAndSaveMany(
    createTestCaseDtos: CreateTestCaseDto[],
    manager?: EntityManager,
  ): Promise<TestCase[]> {
    const repository = this.getRepository(manager);
    const createdTestCases = repository.create(createTestCaseDtos);
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
    updateTestCaseDto: UpdateTestCaseDto,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    const repository = this.getRepository(manager);
    return await repository.update(id, updateTestCaseDto);
  }
  async delete(id: string, manager?: EntityManager): Promise<DeleteResult> {
    const repository = this.getRepository(manager);
    return repository.delete(id);
  }
  async deleteByProblemId(
    id_problem: number,
    manager?: EntityManager,
  ): Promise<DeleteResult> {
    const repository = this.getRepository(manager);
    return repository.delete({ id_problem });
  }
  private getRepository(manager?: EntityManager): Repository<TestCase> {
    return manager ? manager.getRepository(TestCase) : this.testCaseRepository;
  }
}
