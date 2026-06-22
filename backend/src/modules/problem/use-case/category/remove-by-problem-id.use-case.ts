import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepositoryPort } from '../../interface/repository/category.repository.port';

@Injectable()
export class RemoveCategoryByProblemIdUseCase {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(problemId: number): Promise<void> {
    await this.categoryRepository.deleteByProblemId(problemId);
  }
}
