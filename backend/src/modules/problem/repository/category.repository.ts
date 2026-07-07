import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryRepositoryPort } from '../interface/repository/category.repository.port';

@Injectable()
export class CategoryRepository implements CategoryRepositoryPort {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}
  async findByProblemId(
    idProblem: number,
    manager?: EntityManager,
  ): Promise<Category[]> {
    const repository = this.getRepository(manager);
    return await repository.findBy({ idProblem });
  }
  async createAndSave(
    createCategory: Partial<Category>,
    problemId: number,
    manager?: EntityManager,
  ): Promise<Category> {
    const repository = this.getRepository(manager);
    const createdCategory = repository.create({
      category: createCategory.category,
      idProblem: problemId,
    });
    return await repository.save(createdCategory);
  }
  async createAndSaveMany(
    createCategories: Partial<Category>[],
    problemId: number,
    manager?: EntityManager,
  ): Promise<Category[]> {
    const repository = this.getRepository(manager);
    const createdCategories = repository.create(
      createCategories.map((dto) => ({
        category: dto.category,
        idProblem: problemId,
      })),
    );
    return await repository.save(createdCategories);
  }
  async findAll(manager?: EntityManager): Promise<Category[]> {
    const repository = this.getRepository(manager);
    return await repository.find();
  }
  async findById(
    id: number,
    manager?: EntityManager,
  ): Promise<Category | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ id });
  }
  async updateById(
    id: number,
    updateCategory: Partial<Category>,
    manager?: EntityManager,
  ): Promise<Category | null> {
    const repository = this.getRepository(manager);
    const category = await repository.findOneBy({ id });

    if (!category) {
      return null;
    }

    const merged = repository.merge(category, updateCategory);

    return await repository.save(merged);
  }
  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.delete(id);
  }
  async deleteByProblemId(
    idProblem: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.delete({ idProblem });
  }
  private getRepository(manager?: EntityManager): Repository<Category> {
    return (manager ?? this.txHost.tx).getRepository(Category);
  }
}
