import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepositoryPort } from '../../interface/category.repository.port';
import { DeleteResult } from 'typeorm';

@Injectable()
export class RemoveCategoryByProblemIdUseCase {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(problemId: number): Promise<DeleteResult> {
    return await this.categoryRepository.deleteByProblemId(problemId);
  }
}
