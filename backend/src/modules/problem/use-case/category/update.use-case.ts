import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from '../../dto/category/update-category.dto';
import { Category } from '../../entities/category.entity';
import { CategoryRepositoryPort } from '../../interface/repository/category.repository.port';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.updateById(
      id,
      updateCategoryDto,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
