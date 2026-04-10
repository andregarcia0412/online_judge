import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { CreateProblemDto } from '../dto/problem/create-problem.dto';
import { UpdateProblemDto } from '../dto/problem/update-problem.dto';
import { Problem } from '../entities/problem.entity';
import { Category } from '../entities/category.entity';

export interface ProblemRepositoryPort {
  findByTitle(title: string): Promise<Problem | null>;
  createAndSave(createProblemDto: CreateProblemDto): Promise<Problem>;
  findAllOrdered(): Promise<Problem[]>;
  findById(id: number): Promise<Problem | null>;
  updateById(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<UpdateResult>;
  deleteProblemAndChildren(id: number): Promise<DeleteResult>;
}

export const ProblemRepositoryPort = Symbol('ProblemRepositoryPort');
