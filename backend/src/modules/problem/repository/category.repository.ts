import { Injectable } from '@nestjs/common';
import { CategoryRepositoryPort } from '../interface/category.repository.port';
import { UpdateResult, DeleteResult, Repository } from 'typeorm';
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
  async findByProblemId(id_problem: any): Promise<Category[]> {
    return await this.categoryRepository.findBy({ id_problem });
  }
  async createAndSave(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
  ): Promise<Category> {
    const createdCategory = this.categoryRepository.create({
      category: createCategoryDto.category,
      id_problem: problemId,
    });
    return await this.categoryRepository.save(createdCategory);
  }
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }
  async findById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ id });
  }
  async updateById(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryRepository.update(id, updateCategoryDto);
  }
  async delete(id: number): Promise<DeleteResult> {
    return await this.categoryRepository.delete(id);
  }
  async deleteByProblemId(id_problem: number): Promise<DeleteResult> {
    return await this.categoryRepository.delete({ id_problem });
  }
}
