import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CategoryLabels } from '../constants/category.labels';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { ReturnCategoriesDto } from '../dto/category/return-categories.dto';
import { ReturnCategoryDto } from '../dto/category/return-category.dto';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { CategoryEnum } from '../enum/category.enum';
import { CategoryRepositoryPort } from '../interface/category.repository.port';
import { ProblemRepositoryPort } from '../interface/problem.repository.port';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
  ): Promise<ReturnCategoryDto> {
    const problem = await this.problemRepository.findById(problemId);

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return ReturnCategoryDto.fromEntity(
      await this.categoryRepository.createAndSave(createCategoryDto, problemId),
    );
  }

  async findAll(): Promise<ReturnCategoryDto[]> {
    return (await this.categoryRepository.findAll()).map((entity) =>
      ReturnCategoryDto.fromEntity(entity),
    );
  }

  getAvailableCategories(): ReturnCategoriesDto[] {
    return (Object.entries(CategoryLabels) as [CategoryEnum, string][]).map(
      ([value, label]) => new ReturnCategoriesDto(value, label),
    );
  }

  async findOneById(id: number): Promise<ReturnCategoryDto> {
    const savedCategory = await this.categoryRepository.findById(id);

    if (!savedCategory) {
      throw new NotFoundException('Category not found');
    }

    return ReturnCategoryDto.fromEntity(savedCategory);
  }

  async findCategoriesByProblemId(
    problemId: number,
  ): Promise<ReturnCategoryDto[]> {
    const savedProblem = await this.problemRepository.findById(problemId);

    if (!savedProblem) {
      throw new NotFoundException('Problem not found');
    }

    return (await this.categoryRepository.findByProblemId(problemId)).map(
      (entity) => ReturnCategoryDto.fromEntity(entity),
    );
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryRepository.updateById(id, updateCategoryDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.categoryRepository.delete(id);
  }

  async removeByProblemId(id_problem: number): Promise<DeleteResult> {
    return await this.categoryRepository.deleteByProblemId(id_problem);
  }
}
