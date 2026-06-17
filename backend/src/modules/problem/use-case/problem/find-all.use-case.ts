import { Inject, Injectable } from '@nestjs/common';
import { Problem } from '../../entities/problem.entity';
import { ProblemRepositoryPort } from '../../interface/problem.repository.port';
import { ProblemResponse } from './response/problem.response';
import { CategoryRepositoryPort } from '../../interface/category.repository.port';
import { TestCaseRepositoryPort } from '../../interface/test-case.repository.port';

@Injectable()
export class FindAllProblemUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(): Promise<ProblemResponse[]> {
    const problems = await this.problemRepository.findAllOrdered();

    return await Promise.all(
      problems.map(async (problem: Problem) => {
        const categories = await this.categoryRepository.findByProblemId(
          problem.id,
        );
        const testCases = await this.testCaseRepository.findByProblemId(
          problem.id,
        );
        return new ProblemResponse(problem, testCases, categories);
      }),
    );
  }
}
