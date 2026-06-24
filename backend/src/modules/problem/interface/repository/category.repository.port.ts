import { EntityManager } from 'typeorm';
import { Category } from '../../entities/category.entity';

export interface CategoryRepositoryPort {
  createAndSave(
    createCategory: Partial<Category>,
    problemId: number,
    manager?: EntityManager,
  ): Promise<Category>;
  createAndSaveMany(
    createCategories: Partial<Category>[],
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
    updateCategory: Partial<Category>,
    manager?: EntityManager,
  ): Promise<Category | null>;
  delete(id: number, manager?: EntityManager): Promise<void>;
}

export const CategoryRepositoryPort = Symbol('CategoryRepositoryPort');
