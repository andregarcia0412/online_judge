import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCase } from './entities/test-case.entity';
import { Repository } from 'typeorm';
import { ProblemService } from 'src/problem/problem.service';

@Injectable()
export class TestCaseService {
  constructor(
    @InjectRepository(TestCase)
    private testCaseRepository: Repository<TestCase>,
    private problemService: ProblemService,
  ) {}

  async create(createTestCaseDto: CreateTestCaseDto) {
    if (
      !(await this.problemService.findOneById(createTestCaseDto.id_problem))
    ) {
      return new NotFoundException('Problem not found');
    }

    const newTestCase = this.testCaseRepository.create(createTestCaseDto);
    return this.testCaseRepository.save(newTestCase);
  }

  findAll() {
    return this.testCaseRepository.find();
  }

  findOneById(id: string) {
    return this.testCaseRepository.findOneBy({ id });
  }

  findAllByProblemId(id_problem: number) {
    return this.testCaseRepository.findBy({ id_problem });
  }

  update(id: string, updateTestCaseDto: UpdateTestCaseDto) {
    return this.testCaseRepository.update(id, updateTestCaseDto);
  }

  remove(id: string) {
    return this.testCaseRepository.delete(id);
  }
}
