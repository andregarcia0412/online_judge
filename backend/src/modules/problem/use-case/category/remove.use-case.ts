import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CategoryRepositoryPort } from '../../interface/category.repository.port';

@Injectable()
export class RemoveCategoryUseCase {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(id: number): Promise<DeleteResult> {
    return await this.categoryRepository.delete(id);
  }
}
