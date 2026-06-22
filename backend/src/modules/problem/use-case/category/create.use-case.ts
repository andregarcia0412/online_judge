import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepositoryPort } from '../../interface/repository/category.repository.port';
import { CreateCategoryDto } from '../../dto/category/create-category.dto';
import { Category } from '../../entities/category.entity';
import { ProblemRepositoryPort } from '../../interface/repository/problem.repository.port';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async execute(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
  ): Promise<Category> {
    const problem = await this.problemRepository.findById(problemId);

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return await this.categoryRepository.createAndSave(
      createCategoryDto,
      problemId,
    );
  }
}
