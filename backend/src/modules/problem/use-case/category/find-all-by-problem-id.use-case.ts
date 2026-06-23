import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';
import { Category } from '../../entities/category.entity';
import { CategoryRepositoryPort } from '../../interface/repository/category.repository.port';

@Injectable()
export class FindAllCategoriesByProblemIdUseCase {
  constructor(
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(idProblem: number): Promise<Category[]> {
    const savedProblem = await this.problemRepository.findById(idProblem);

    if (!savedProblem) {
      throw new NotFoundException('Problem not found');
    }

    return await this.categoryRepository.findByProblemId(idProblem);
  }
}
