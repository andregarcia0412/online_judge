import { Category } from '../../entities/category.entity';

export interface CategoryRepositoryPort {
  createAndSave(
    createCategory: Partial<Category>,
    problemId: number,
  ): Promise<Category>;
  createAndSaveMany(
    createCategories: Partial<Category>[],
    problemId: number,
  ): Promise<Category[]>;
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  findByProblemId(id_problem: number): Promise<Category[]>;
  updateById(
    id: number,
    updateCategory: Partial<Category>,
  ): Promise<Category | null>;
  delete(id: number): Promise<void>;
}

export const CategoryRepositoryPort = Symbol('CategoryRepositoryPort');
