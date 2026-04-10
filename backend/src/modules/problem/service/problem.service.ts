import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm/browser';
import { ReturnTestCaseDto } from '../dto/test-case/return-test-case.dto';
import { TestCase } from '../entities/test-case.entity';
import { CreateProblemDto } from '../dto/problem/create-problem.dto';
import { ReturnProblemDto } from '../dto/problem/return-problem.dto';
import { UpdateProblemDto } from '../dto/problem/update-problem.dto';
import { Problem } from '../entities/problem.entity';
import { ProblemRepositoryPort } from '../interface/problem.repository.port';
import { TestCaseRepositoryPort } from 'src/modules/problem/interface/test-case.repository.port';
import { CategoryRepositoryPort } from '../interface/category.repository.port';

@Injectable()
export class ProblemService {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async create(createProblemDto: CreateProblemDto): Promise<ReturnProblemDto> {
    if (await this.problemRepository.findByTitle(createProblemDto.title)) {
      throw new ConflictException('A problem with this title already exists');
    }
    return ReturnProblemDto.fromEntity(
      await this.problemRepository.createAndSave(createProblemDto),
    );
  }

  async findAll(): Promise<ReturnProblemDto[]> {
    const problems = await this.problemRepository.findAllOrdered();

    return await Promise.all(
      problems.map(async (problem: Problem) => {
        const categories = await this.categoryRepository.findByProblemId(
          problem.id,
        );
        return ReturnProblemDto.fromEntity(problem, categories);
      }),
    );
  }

  async findOneById(id: number): Promise<ReturnProblemDto> {
    const problem = await this.problemRepository.findById(id);
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const categories = await this.categoryRepository.findByProblemId(
      problem.id,
    );

    return ReturnProblemDto.fromEntity(problem, categories);
  }

  async findOneByTitle(title: string): Promise<ReturnProblemDto> {
    const problem = await this.problemRepository.findByTitle(title);
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const categories = await this.categoryRepository.findByProblemId(
      problem.id,
    );

    return ReturnProblemDto.fromEntity(problem, categories);
  }

  async findAllTestCasesById(id: number): Promise<ReturnTestCaseDto[]> {
    return (await this.testCaseRepository.findByProblemId(id)).map(
      (testCase: TestCase) => ReturnTestCaseDto.fromEntity(testCase),
    );
  }

  async update(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<UpdateResult> {
    return await this.problemRepository.updateById(id, updateProblemDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.problemRepository.deleteProblemAndChildren(id);
  }
}
