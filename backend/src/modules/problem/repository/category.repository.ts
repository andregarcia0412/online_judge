import { Injectable } from '@nestjs/common';
import { CategoryRepositoryPort } from '../interface/category.repository.port';
import { UpdateResult, DeleteResult, Repository, EntityManager } from 'typeorm';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryRepository implements CategoryRepositoryPort {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async findByProblemId(
    id_problem: any,
    manager?: EntityManager,
  ): Promise<Category[]> {
    const repository = this.getRepository(manager);
    return await repository.findBy({ id_problem });
  }
  async createAndSave(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
    manager?: EntityManager,
  ): Promise<Category> {
    const repository = this.getRepository(manager);
    const createdCategory = repository.create({
      category: createCategoryDto.category,
      id_problem: problemId,
    });
    return await repository.save(createdCategory);
  }
  async createAndSaveMany(
    createCategoryDtos: CreateCategoryDto[],
    problemId: number,
    manager?: EntityManager,
  ): Promise<Category[]> {
    const repository = this.getRepository(manager);
    const createdCategories = repository.create(
      createCategoryDtos.map((dto) => ({
        category: dto.category,
        id_problem: problemId,
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
    updateCategoryDto: UpdateCategoryDto,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    const repository = this.getRepository(manager);
    return await repository.update(id, updateCategoryDto);
  }
  async delete(id: number, manager?: EntityManager): Promise<DeleteResult> {
    const repository = this.getRepository(manager);
    return await repository.delete(id);
  }
  async deleteByProblemId(
    id_problem: number,
    manager?: EntityManager,
  ): Promise<DeleteResult> {
    const repository = this.getRepository(manager);
    return await repository.delete({ id_problem });
  }
  private getRepository(manager?: EntityManager): Repository<Category> {
    return manager ? manager.getRepository(Category) : this.categoryRepository;
  }
}
