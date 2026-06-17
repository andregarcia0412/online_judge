import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepositoryPort } from '../../interface/category.repository.port';
import { UpdateCategoryDto } from '../../dto/category/update-category.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryRepository.updateById(id, updateCategoryDto);
  }
}
