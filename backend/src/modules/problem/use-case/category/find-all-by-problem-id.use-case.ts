import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProblemRepositoryPort } from '../../interface/problem.repository.port';
import { Category } from '../../entities/category.entity';
import { CategoryRepositoryPort } from '../../interface/category.repository.port';

@Injectable()
export class FindAllCategoriesByProblemIdUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(problemId: number): Promise<Category[]> {
    const savedProblem = await this.problemRepository.findById(problemId);

    if (!savedProblem) {
      throw new NotFoundException('Problem not found');
    }

    return await this.categoryRepository.findByProblemId(problemId);
  }
}
