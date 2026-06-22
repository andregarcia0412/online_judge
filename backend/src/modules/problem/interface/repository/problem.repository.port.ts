import { EntityManager, UpdateResult } from 'typeorm';
import { CreateProblemDto } from '../../dto/problem/create-problem.dto';
import { UpdateProblemDto } from '../../dto/problem/update-problem.dto';
import { Problem } from '../../entities/problem.entity';

export interface ProblemRepositoryPort {
  findByTitle(title: string, manager?: EntityManager): Promise<Problem | null>;
  createAndSave(
    createProblemDto: CreateProblemDto,
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
    updateProblemDto: UpdateProblemDto,
    manager?: EntityManager,
  ): Promise<UpdateResult>;
  delete(id: number, manager?: EntityManager): Promise<void>;
}

export const ProblemRepositoryPort = Symbol('ProblemRepositoryPort');
