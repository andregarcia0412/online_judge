import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TestCaseRepositoryPort } from 'src/modules/problem/interface/test-case.repository.port';
import { DeleteResult, UpdateResult } from 'typeorm';
import { DataSource } from 'typeorm';
import { ReturnCategoryDto } from '../dto/category/return-category.dto';
import { CreateProblemDto } from '../dto/problem/create-problem.dto';
import { ReturnProblemDto } from '../dto/problem/return-problem.dto';
import { UpdateProblemDto } from '../dto/problem/update-problem.dto';
import { ReturnTestCaseDto } from '../dto/test-case/return-test-case.dto';
import { Problem } from '../entities/problem.entity';
import { TestCase } from '../entities/test-case.entity';
import { CategoryRepositoryPort } from '../interface/category.repository.port';
import { ProblemRepositoryPort } from '../interface/problem.repository.port';

@Injectable()
export class ProblemService {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProblemDto: CreateProblemDto): Promise<ReturnProblemDto> {
    return await this.dataSource.transaction(async (manager) => {
      if (
        await this.problemRepository.findByTitle(
          createProblemDto.title,
          manager,
        )
      ) {
        throw new ConflictException('A problem with this title already exists');
      }

      const savedProblem = await this.problemRepository.createAndSave(
        createProblemDto,
        manager,
      );

      const savedCategories = await this.categoryRepository.createAndSaveMany(
        createProblemDto.category,
        savedProblem.id,
        manager,
      );

      createProblemDto.test_cases.map(
        (testCase) => (testCase.id_problem = savedProblem.id),
      );

      const savedTestCases = await this.testCaseRepository.createAndSaveMany(
        createProblemDto.test_cases,
        manager,
      );

      return ReturnProblemDto.fromEntity(
        savedProblem,
        ReturnCategoryDto.fromEntityList(savedCategories),
        ReturnTestCaseDto.fromEntityList(savedTestCases),
      );
    });
  }

  async findAll(): Promise<ReturnProblemDto[]> {
    const problems = await this.problemRepository.findAllOrdered();

    return await Promise.all(
      problems.map(async (problem: Problem) => {
        const categories = await this.categoryRepository.findByProblemId(
          problem.id,
        );
        const testCases = await this.testCaseRepository.findByProblemId(
          problem.id,
        );
        return ReturnProblemDto.fromEntity(problem, categories, testCases);
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

    const testCases = await this.testCaseRepository.findByProblemId(problem.id);

    return ReturnProblemDto.fromEntity(problem, categories, testCases);
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
    return await this.problemRepository.delete(id);
  }
}
