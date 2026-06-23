import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Problem } from '../entities/problem.entity';
import { ProblemRepositoryPort } from '../interface/repository/problem.repository.port';

@Injectable()
export class ProblemRepository implements ProblemRepositoryPort {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}
  async findByTitle(
    title: string,
    manager?: EntityManager,
  ): Promise<Problem | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ title });
  }
  async createAndSave(
    createProblem: Partial<Problem>,
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
  async findAllOrdered(manager?: EntityManager): Promise<Problem[]> {
    const repository = this.getRepository(manager);
    return await repository.find({
      order: {
        id: 'ASC',
      },
    });
  }
  async findById(id: number, manager?: EntityManager): Promise<Problem | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ id });
  }
  async updateById(
    id: number,
    updateProblem: Partial<Problem>,
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
    return manager ? manager.getRepository(Problem) : this.problemRepository;
  }
}
