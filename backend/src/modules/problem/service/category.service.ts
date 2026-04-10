import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { UpdateCategoryDto } from '../dto/category/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { Problem } from '../entities/problem.entity';
import { ReturnCategoryDto } from '../dto/category/return-category.dto';
import { UpdateResult } from 'typeorm/browser';
import { DeleteResult } from 'typeorm/browser';
import { CategoryRepositoryPort } from '../interface/category.repository.port';
import { ProblemRepositoryPort } from '../interface/problem.repository.port';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CategoryRepositoryPort)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(ProblemRepositoryPort)
    private readonly problemRepository: ProblemRepositoryPort,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    problemId: number,
  ): Promise<ReturnCategoryDto> {
    const problem = await this.problemRepository.findById(problemId);

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    return ReturnCategoryDto.fromEntity(
      await this.categoryRepository.createAndSave(createCategoryDto, problemId),
    );
  }

  async findAll(): Promise<ReturnCategoryDto[]> {
    return (await this.categoryRepository.findAll()).map((entity) =>
      ReturnCategoryDto.fromEntity(entity),
    );
  }

  async findOneById(id: number): Promise<ReturnCategoryDto> {
    const savedCategory = await this.categoryRepository.findById(id);

    if (!savedCategory) {
      throw new NotFoundException('Category not found');
    }

    return ReturnCategoryDto.fromEntity(savedCategory);
  }

  async findCategoriesByProblemId(
    problemId: number,
  ): Promise<ReturnCategoryDto[]> {
    const savedProblem = await this.problemRepository.findById(problemId);

    if (!savedProblem) {
      throw new NotFoundException('Problem not found');
    }

    return (await this.categoryRepository.findByProblemId(problemId)).map(
      (entity) => ReturnCategoryDto.fromEntity(entity),
    );
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryRepository.updateById(id, updateCategoryDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.categoryRepository.delete(id);
  }

  async removeByProblemId(id_problem: number): Promise<DeleteResult> {
    return await this.categoryRepository.deleteByProblemId(id_problem);
  }
}
