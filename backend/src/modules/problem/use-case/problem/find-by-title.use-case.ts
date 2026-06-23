import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';
import { CategoryRepositoryPort } from '../../interface/repository/category.repository.port';
import { TestCaseRepositoryPort } from '../../interface/repository/test-case.repository.port';
import { ProblemResponse } from './response/problem.response';

@Injectable()
export class FindProblemByTitleUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(title: string): Promise<ProblemResponse> {
    const problem = await this.problemRepository.findByTitle(title);
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const categories = await this.categoryRepository.findByProblemId(
      problem.id,
    );

    const testCases = await this.testCaseRepository.findByProblemId(problem.id);

    return new ProblemResponse(problem, testCases, categories);
  }
}
