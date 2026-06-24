import { DeepPartial, EntityManager } from 'typeorm';
import { Problem } from '../../entities/problem.entity';

export interface ProblemRepositoryPort {
  findByTitle(title: string, manager?: EntityManager): Promise<Problem | null>;
  createAndSave(
    createProblem: DeepPartial<Problem>,
    manager?: EntityManager,
  ): Promise<Problem>;
  saveExistingEntity(
    problem: Problem,
    manager?: EntityManager,
  ): Promise<Problem>;
  findAllOrdered(manager?: EntityManager): Promise<Problem[]>;
  findById(id: number, manager?: EntityManager): Promise<Problem | null>;
  updateById(
    id: number,
    updateProblemDto: DeepPartial<Problem>,
    manager?: EntityManager,
  ): Promise<Problem | null>;
  delete(id: number, manager?: EntityManager): Promise<void>;
}

export const ProblemRepositoryPort = Symbol('ProblemRepositoryPort');
