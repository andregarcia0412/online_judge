import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProblemRepositoryPort } from '../../interface/problem.repository.port';
import { ProblemResponse } from './response/problem.response';
import { CategoryRepositoryPort } from '../../interface/category.repository.port';
import { TestCaseRepositoryPort } from '../../interface/test-case.repository.port';

@Injectable()
export class FindProblemByIdUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(id: number): Promise<ProblemResponse> {
    const problem = await this.problemRepository.findById(id);
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
