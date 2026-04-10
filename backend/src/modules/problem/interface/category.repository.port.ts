import { UpdateResult } from 'typeorm';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { Category } from '../entities/category.entity';
import { DeleteResult } from 'typeorm/browser';

export interface CategoryRepositoryPort {
  createAndSave(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
  ): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  findByProblemId(id_problem: number): Promise<Category[]>;
  updateById(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult>;
  delete(id: number): Promise<DeleteResult>;
  deleteByProblemId(id_problem: number): Promise<DeleteResult>;
}

export const CategoryRepositoryPort = Symbol('CategoryRepositoryPort');
