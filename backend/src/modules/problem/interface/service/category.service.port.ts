import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateCategoryDto } from '../../dto/category/create-category.dto';
import { ReturnCategoriesDto } from '../../dto/category/return-categories.dto';
import { ReturnCategoryDto } from '../../dto/category/return-category.dto';
import { UpdateCategoryDto } from '../../dto/category/update-category.dto';

export interface CategoryServicePort {
  create(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
  ): Promise<ReturnCategoryDto>;
  findAll(): Promise<ReturnCategoryDto[]>;
  getAvailableCategories(): ReturnCategoriesDto[];
  findOneById(id: number): Promise<ReturnCategoryDto>;
  findCategoriesByProblemId(problemId: number): Promise<ReturnCategoryDto[]>;
  update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult>;
  remove(id: number): Promise<DeleteResult>;
  removeByProblemId(problemId: number): Promise<DeleteResult>;
}

export const CategoryServicePort = Symbol('CategoryServicePort');
