import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepositoryPort } from '../../interface/repository/category.repository.port';
import { Category } from '../../entities/category.entity';

@Injectable()
export class FindCategoryByIdUseCase {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
