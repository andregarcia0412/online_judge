import { Injectable } from '@nestjs/common';
import { TestCaseRepositoryPort } from '../interface/test-case.repository.port';
import { UpdateResult, DeleteResult, Repository } from 'typeorm';
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
  async findByProblemId(id_problem: number): Promise<TestCase[]> {
    return await this.testCaseRepository.findBy({ id_problem });
  }
  async createAndSave(createTestCaseDto: CreateTestCaseDto): Promise<TestCase> {
    const createdTestCase = this.testCaseRepository.create(createTestCaseDto);
    return await this.testCaseRepository.save(createdTestCase);
  }
  async findAll(): Promise<TestCase[]> {
    return await this.testCaseRepository.find();
  }
  async findOneById(id: string): Promise<TestCase | null> {
    return await this.testCaseRepository.findOneBy({ id });
  }
  async updateById(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<UpdateResult> {
    return await this.testCaseRepository.update(id, updateTestCaseDto);
  }
  async delete(id: string): Promise<DeleteResult> {
    return this.testCaseRepository.delete(id);
  }
  async deleteByProblemId(id_problem: number): Promise<DeleteResult> {
    return this.testCaseRepository.delete({ id_problem });
  }
}
