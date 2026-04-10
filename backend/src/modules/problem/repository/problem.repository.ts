import { Inject, Injectable } from '@nestjs/common';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateProblemDto } from '../dto/problem/create-problem.dto';
import { UpdateProblemDto } from '../dto/problem/update-problem.dto';
import { Problem } from '../entities/problem.entity';
import { ProblemRepositoryPort } from '../interface/problem.repository.port';
import { CategoryRepository } from './category.repository';
import { TestCaseRepository } from 'src/modules/problem/repository/test-case.repository';
import { CategoryRepositoryPort } from '../interface/category.repository.port';
import { Category } from '../entities/category.entity';
import { TestCaseRepositoryPort } from 'src/modules/problem/interface/test-case.repository.port';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProblemRepository implements ProblemRepositoryPort {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}
  async findByTitle(title: string): Promise<Problem | null> {
    return await this.problemRepository.findOneBy({ title });
  }
  async createAndSave(createProblemDto: CreateProblemDto): Promise<Problem> {
    const createdProblem = this.problemRepository.create(createProblemDto);
    return await this.problemRepository.save(createdProblem);
  }
  async findAllOrdered(): Promise<Problem[]> {
    return await this.problemRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }
  async findById(id: number): Promise<Problem | null> {
    return await this.problemRepository.findOneBy({ id });
  }
  async updateById(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<UpdateResult> {
    return await this.problemRepository.update(id, updateProblemDto);
  }
  async deleteProblemAndChildren(id: number): Promise<DeleteResult> {
    return await this.problemRepository.delete(id);
  }
}
