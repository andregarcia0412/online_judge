import { EntityManager, UpdateResult } from 'typeorm';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { Category } from '../entities/category.entity';
import { DeleteResult } from 'typeorm';

export interface CategoryRepositoryPort {
  createAndSave(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
    manager?: EntityManager,
  ): Promise<Category>;
  createAndSaveMany(
    createCategoryDtos: CreateCategoryDto[],
    problemId: number,
    manager?: EntityManager,
  ): Promise<Category[]>;
  findAll(manager?: EntityManager): Promise<Category[]>;
  findById(id: number, manager?: EntityManager): Promise<Category | null>;
  findByProblemId(
    id_problem: number,
    manager?: EntityManager,
  ): Promise<Category[]>;
  updateById(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    manager?: EntityManager,
  ): Promise<UpdateResult>;
  delete(id: number, manager?: EntityManager): Promise<DeleteResult>;
  deleteByProblemId(
    id_problem: number,
    manager?: EntityManager,
  ): Promise<DeleteResult>;
}

export const CategoryRepositoryPort = Symbol('CategoryRepositoryPort');
