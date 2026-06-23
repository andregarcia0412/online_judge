import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepositoryPort } from '../../interface/repository/category.repository.port';

@Injectable()
export class RemoveCategoryUseCase {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
