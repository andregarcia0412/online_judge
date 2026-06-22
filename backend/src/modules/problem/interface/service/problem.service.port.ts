import { UpdateResult } from 'typeorm';
import { CreateProblemDto } from '../../dto/problem/create-problem.dto';
import { ReturnProblemDto } from '../../dto/problem/return-problem.dto';
import { UpdateProblemDto } from '../../dto/problem/update-problem.dto';

export interface ProblemServicePort {
  create(createProblemDto: CreateProblemDto): Promise<ReturnProblemDto>;
  findAll(): Promise<ReturnProblemDto[]>;
  findOneById(id: number): Promise<ReturnProblemDto>;
  findOneByTitle(title: string): Promise<ReturnProblemDto>;
  update(id: number, updateProblemDto: UpdateProblemDto): Promise<UpdateResult>;
  remove(id: number): Promise<void>;
}

export const ProblemServicePort = Symbol('ProblemServicePort');
