import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Problem } from '../entities/problem.entity';
import { ProblemRepositoryPort } from '../interface/repository/problem.repository.port';

@Injectable()
export class ProblemRepository implements ProblemRepositoryPort {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}
  async findByTitle(title: string): Promise<Problem | null> {
    return await this.problemRepository.findOneBy({ title });
  }
  async createAndSave(createProblem: DeepPartial<Problem>): Promise<Problem> {
    const createdProblem = this.problemRepository.create(createProblem);
    return await this.problemRepository.save(createdProblem);
  }
  async saveExistingEntity(problem: Problem): Promise<Problem> {
    return await this.problemRepository.save(problem);
  }
  async findAllOrdered(
    page: number,
    limit: number,
  ): Promise<[Problem[], number]> {
    return await this.problemRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }
  async findById(id: number): Promise<Problem | null> {
    return await this.problemRepository.findOneBy({ id });
  }
  async updateById(
    id: number,
    updateProblem: DeepPartial<Problem>,
  ): Promise<Problem | null> {
    const problem = await this.problemRepository.findOneBy({ id });

    if (!problem) {
      return null;
    }

    const merged = this.problemRepository.merge(problem, updateProblem);
    return await this.problemRepository.save(merged);
  }
  async delete(id: number): Promise<void> {
    await this.problemRepository.delete(id);
  }

  private get problemRepository(): Repository<Problem> {
    return this.txHost.tx.getRepository(Problem);
  }
}
