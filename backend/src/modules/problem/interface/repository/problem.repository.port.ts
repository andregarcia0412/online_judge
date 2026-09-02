import { DeepPartial } from 'typeorm';
import { Problem } from '../../entities/problem.entity';

export interface ProblemRepositoryPort {
  findByTitle(title: string): Promise<Problem | null>;
  createAndSave(createProblem: DeepPartial<Problem>): Promise<Problem>;
  saveExistingEntity(problem: Problem): Promise<Problem>;
  findAllOrdered(page: number, limit: number): Promise<[Problem[], number]>;
  findById(id: number): Promise<Problem | null>;
  updateById(
    id: number,
    updateProblemDto: DeepPartial<Problem>,
  ): Promise<Problem | null>;
  delete(id: number): Promise<void>;
}

export const ProblemRepositoryPort = Symbol('ProblemRepositoryPort');
