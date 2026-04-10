import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { Problem } from '../entities/problem.entity';
import { ReturnCategoryDto } from '../dto/category/return-category.dto';
import { UpdateResult } from 'typeorm/browser';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
  ): Promise<ReturnCategoryDto> {
    const problem = await this.problemRepository.findOneBy({
      id: problemId,
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const newCategory = this.categoryRepository.create({
      id_problem: problemId,
      category: createCategoryDto.category,
    });

    return ReturnCategoryDto.fromEntity(
      await this.categoryRepository.save(newCategory),
    );
  }

  async findAll(): Promise<ReturnCategoryDto[]> {
    return (await this.categoryRepository.find()).map((entity) =>
      ReturnCategoryDto.fromEntity(entity),
    );
  }

  async findOneById(id: number): Promise<ReturnCategoryDto> {
    const savedCategory = await this.categoryRepository.findOneBy({ id });

    if (!savedCategory) {
      throw new NotFoundException('Category not found');
    }

    return ReturnCategoryDto.fromEntity(savedCategory);
  }

  async findCategoriesByProblemId(
    problemId: number,
  ): Promise<ReturnCategoryDto[]> {
    const savedProblem = await this.problemRepository.findOneBy({
      id: problemId,
    });

    if (!savedProblem) {
      throw new NotFoundException('Problem not found');
    }

    return (
      await this.categoryRepository.findBy({ id_problem: problemId })
    ).map((entity) => ReturnCategoryDto.fromEntity(entity));
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.categoryRepository.delete(id);
  }

  async removeByProblemId(id_problem: number): Promise<DeleteResult> {
    return await this.categoryRepository.delete({ id_problem });
  }
}
