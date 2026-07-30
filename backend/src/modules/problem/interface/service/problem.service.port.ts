import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { CreateProblemDto } from '../../dto/problem/create-problem.dto';
import { ReturnProblemDto } from '../../dto/problem/return-problem.dto';
import { UpdateProblemDto } from '../../dto/problem/update-problem.dto';
import { Problem } from '../../entities/problem.entity';
import { ReturnProblemListDto } from '../../dto/problem/return-problem-list.dto';

export interface ProblemServicePort {
  create(createProblemDto: CreateProblemDto): Promise<ReturnProblemDto>;
  findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<ReturnProblemListDto>;
  findOneById(id: number): Promise<ReturnProblemDto>;
  findProblemEntityById(id: number): Promise<Problem>;
  findOneByTitle(title: string): Promise<ReturnProblemDto>;
  update(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<ReturnProblemDto>;
  remove(id: number): Promise<void>;
}

export const ProblemServicePort = Symbol('ProblemServicePort');
