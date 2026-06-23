import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProblemDto } from '../../dto/problem/update-problem.dto';
import { CategoryRepositoryPort } from '../../interface/repository/category.repository.port';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';
import { TestCaseRepositoryPort } from '../../interface/repository/test-case.repository.port';
import { ProblemResponse } from './response/problem.response';

@Injectable()
export class UpdateProblemUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(TestCaseRepositoryPort)
    private readonly testCaseRepository: TestCaseRepositoryPort,
  ) {}

  async execute(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<ProblemResponse> {
    const problem = await this.problemRepository.updateById(
      id,
      updateProblemDto,
    );

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const categories = await this.categoryRepository.findByProblemId(id);
    const testCases = await this.testCaseRepository.findByProblemId(id);

    return new ProblemResponse(problem, testCases, categories);
  }
}
