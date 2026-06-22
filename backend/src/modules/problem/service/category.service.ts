import { Inject, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { CategoryLabels } from '../constants/category.labels';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { ReturnCategoriesDto } from '../dto/category/return-categories.dto';
import { ReturnCategoryDto } from '../dto/category/return-category.dto';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { CategoryEnum } from '../enum/category.enum';
import { CategoryServicePort } from '../interface/service/category.service.port';
import { CreateCategoryUseCase } from '../use-case/category/create.use-case';
import { FindAllCategoriesByProblemIdUseCase } from '../use-case/category/find-all-by-problem-id.use-case';
import { FindAllCategoriesUseCase } from '../use-case/category/find-all.use-case';
import { FindCategoryByIdUseCase } from '../use-case/category/find-by-id.use-case';
import { RemoveCategoryByProblemIdUseCase } from '../use-case/category/remove-by-problem-id.use-case';
import { RemoveCategoryUseCase } from '../use-case/category/remove.use-case';
import { UpdateCategoryUseCase } from '../use-case/category/update.use-case';

@Injectable()
export class CategoryService implements CategoryServicePort {
  constructor(
    @Inject(CreateCategoryUseCase)
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    @Inject(FindAllCategoriesUseCase)
    private readonly findAllCategoriesUseCase: FindAllCategoriesUseCase,
    @Inject(FindCategoryByIdUseCase)
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
    @Inject(FindAllCategoriesByProblemIdUseCase)
    private readonly findAllCategoriesByProblemIdUseCase: FindAllCategoriesByProblemIdUseCase,
    @Inject(UpdateCategoryUseCase)
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    @Inject(RemoveCategoryUseCase)
    private readonly removeCategoryUseCase: RemoveCategoryUseCase,
    @Inject(RemoveCategoryByProblemIdUseCase)
    private readonly removeCategoryByProblemIdUseCase: RemoveCategoryByProblemIdUseCase,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
  ): Promise<ReturnCategoryDto> {
    return ReturnCategoryDto.fromEntity(
      await this.createCategoryUseCase.execute(createCategoryDto, problemId),
    );
  }

  async findAll(): Promise<ReturnCategoryDto[]> {
    return ReturnCategoryDto.fromEntityList(
      await this.findAllCategoriesUseCase.execute(),
    );
  }

  getAvailableCategories(): ReturnCategoriesDto[] {
    return (Object.entries(CategoryLabels) as [CategoryEnum, string][]).map(
      ([value, label]) => new ReturnCategoriesDto(value, label),
    );
  }

  async findOneById(id: number): Promise<ReturnCategoryDto> {
    return ReturnCategoryDto.fromEntity(
      await this.findCategoryByIdUseCase.execute(id),
    );
  }

  async findCategoriesByProblemId(
    problemId: number,
  ): Promise<ReturnCategoryDto[]> {
    return ReturnCategoryDto.fromEntityList(
      await this.findAllCategoriesByProblemIdUseCase.execute(problemId),
    );
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.updateCategoryUseCase.execute(id, updateCategoryDto);
  }

  async remove(id: number): Promise<void> {
    await this.removeCategoryUseCase.execute(id);
  }

  async removeByProblemId(problemId: number): Promise<void> {
    await this.removeCategoryByProblemIdUseCase.execute(problemId);
  }
}
