import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { Problem } from '../entities/problem.entity';
import { ProblemRepositoryPort } from '../interface/repository/problem.repository.port';

@Injectable()
export class ProblemRepository implements ProblemRepositoryPort {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}
  async findByTitle(
    title: string,
    manager?: EntityManager,
  ): Promise<Problem | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ title });
  }
  async createAndSave(
    createProblem: DeepPartial<Problem>,
    manager?: EntityManager,
  ): Promise<Problem> {
    const repository = this.getRepository(manager);
    const createdProblem = repository.create(createProblem);
    return await repository.save(createdProblem);
  }
  async saveExistingEntity(
    problem: Problem,
    manager?: EntityManager,
  ): Promise<Problem> {
    const repository = this.getRepository(manager);
    return await repository.save(problem);
  }
  async findAllOrdered(
    page: number,
    limit: number,
    manager?: EntityManager,
  ): Promise<[Problem[], number]> {
    const repository = this.getRepository(manager);
    return await repository.findAndCount({
      order: {
        id: 'ASC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }
  async findById(id: number, manager?: EntityManager): Promise<Problem | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ id });
  }
  async updateById(
    id: number,
    updateProblem: DeepPartial<Problem>,
    manager?: EntityManager,
  ): Promise<Problem | null> {
    const repository = this.getRepository(manager);
    const problem = await repository.findOneBy({ id });

    if (!problem) {
      return null;
    }

    const merged = repository.merge(problem, updateProblem);
    return await repository.save(merged);
  }
  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.delete(id);
  }

  private getRepository(manager?: EntityManager): Repository<Problem> {
    return (manager ?? this.txHost.tx).getRepository(Problem);
  }
}
