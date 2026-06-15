import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProblemDto } from '../../dto/problem/create-problem.dto';
import { CategoryRepositoryPort } from '../../interface/category.repository.port';
import { ProblemRepositoryPort } from '../../interface/problem.repository.port';
import { TestCaseRepositoryPort } from '../../interface/test-case.repository.port';
import { ProblemResponse } from './response/problem.response';

@Injectable()
export class CreateProblemUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
    private readonly dataSource: DataSource,
  ) {}

  async execute(createProblemDto: CreateProblemDto): Promise<ProblemResponse> {
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

      return new ProblemResponse(savedProblem, savedTestCases, savedCategories);
    });
  }
}
