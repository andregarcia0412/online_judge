import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteResult, UpdateResult } from 'typeorm/browser';
import { ReturnTestCaseDto } from '../test-case/dto/return-test-case.dto';
import { TestCase } from '../test-case/entities/test-case.entity';
import { CreateProblemDto } from './dto/create-problem.dto';
import { ReturnProblemDto } from './dto/return-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private testCaseRepository: Repository<TestCase>,
  ) {}

  async create(createProblemDto: CreateProblemDto): Promise<ReturnProblemDto> {
    if (
      await this.problemRepository.findOneBy({
        number: createProblemDto.number,
      })
    ) {
      throw new ConflictException('This number is already in use');
    }

    const newProblem = this.problemRepository.create(createProblemDto);
    return ReturnProblemDto.fromEntity(
      await this.problemRepository.save(newProblem),
    );
  }

  async findAll(): Promise<ReturnProblemDto[]> {
    return (await this.problemRepository.find()).map((problem: Problem) =>
      ReturnProblemDto.fromEntity(problem),
    );
  }

  async findOneById(id: number): Promise<ReturnProblemDto> {
    const problem = await this.problemRepository.findOneBy({ id });
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }
    return ReturnProblemDto.fromEntity(problem);
  }

  async findOneByTitle(title: string): Promise<ReturnProblemDto> {
    const problem = await this.problemRepository.findOneBy({ title });
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return ReturnProblemDto.fromEntity(problem);
  }

  async findOneByNumber(number: number): Promise<ReturnProblemDto> {
    const problem = await this.problemRepository.findOneBy({ number });
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }
    return ReturnProblemDto.fromEntity(problem);
  }

  async findAllTestCasesById(id: number): Promise<ReturnTestCaseDto[]> {
    return (await this.testCaseRepository.findBy({ id_problem: id })).map(
      (testCase: TestCase) => ReturnTestCaseDto.fromEntity(testCase),
    );
  }

  async update(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<UpdateResult> {
    return await this.problemRepository.update(id, updateProblemDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.problemRepository.delete(id);
  }
}
