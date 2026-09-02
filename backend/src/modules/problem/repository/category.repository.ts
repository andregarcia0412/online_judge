import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryRepositoryPort } from '../interface/repository/category.repository.port';

@Injectable()
export class CategoryRepository implements CategoryRepositoryPort {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}
  async findByProblemId(idProblem: number): Promise<Category[]> {
    return await this.categoryRepository.findBy({ idProblem });
  }
  async createAndSave(
    createCategory: Partial<Category>,
    problemId: number,
  ): Promise<Category> {
    const createdCategory = this.categoryRepository.create({
      category: createCategory.category,
      idProblem: problemId,
    });
    return await this.categoryRepository.save(createdCategory);
  }
  async createAndSaveMany(
    createCategories: Partial<Category>[],
    problemId: number,
  ): Promise<Category[]> {
    const createdCategories = this.categoryRepository.create(
      createCategories.map((dto) => ({
        category: dto.category,
        idProblem: problemId,
      })),
    );
    return await this.categoryRepository.save(createdCategories);
  }
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }
  async findById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ id });
  }
  async updateById(
    id: number,
    updateCategory: Partial<Category>,
  ): Promise<Category | null> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      return null;
    }

    const merged = this.categoryRepository.merge(category, updateCategory);

    return await this.categoryRepository.save(merged);
  }
  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
  async deleteByProblemId(idProblem: number): Promise<void> {
    await this.categoryRepository.delete({ idProblem });
  }
  private get categoryRepository(): Repository<Category> {
    return this.txHost.tx.getRepository(Category);
  }
}
