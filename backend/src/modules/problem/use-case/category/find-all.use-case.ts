import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepositoryPort } from '../../interface/repository/category.repository.port';
import { Category } from '../../entities/category.entity';

@Injectable()
export class FindAllCategoriesUseCase {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
