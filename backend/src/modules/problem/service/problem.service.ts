import { Inject, Injectable } from '@nestjs/common';
import { CreateProblemDto } from '../dto/problem/create-problem.dto';
import { ReturnProblemDto } from '../dto/problem/return-problem.dto';
import { UpdateProblemDto } from '../dto/problem/update-problem.dto';
import { ProblemServicePort } from '../interface/service/problem.service.port';
import { CreateProblemUseCase } from '../use-case/problem/create.use-case';
import { FindAllProblemUseCase } from '../use-case/problem/find-all.use-case';
import { FindProblemByIdUseCase } from '../use-case/problem/find-by-id.use-case';
import { FindProblemByTitleUseCase } from '../use-case/problem/find-by-title.use-case';
import { RemoveProblemUseCase } from '../use-case/problem/remove.use-case';
import { UpdateProblemUseCase } from '../use-case/problem/update.use-case';
import { Problem } from '../entities/problem.entity';
import { ReturnProblemListDto } from '../dto/problem/return-problem-list.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@Injectable()
export class ProblemService implements ProblemServicePort {
  constructor(
    @Inject(CreateProblemUseCase)
    private readonly createProblemUseCase: CreateProblemUseCase,
    @Inject(FindAllProblemUseCase)
    private readonly findAllProblemUseCase: FindAllProblemUseCase,
    @Inject(FindProblemByIdUseCase)
    private readonly findProblemByIdUseCase: FindProblemByIdUseCase,
    @Inject(FindProblemByTitleUseCase)
    private readonly findProblemByTitleUseCase: FindProblemByTitleUseCase,
    @Inject(UpdateProblemUseCase)
    private readonly updateProblemUseCase: UpdateProblemUseCase,
    @Inject(RemoveProblemUseCase)
    private readonly removeProblemUseCase: RemoveProblemUseCase,
  ) {}

  async create(createProblemDto: CreateProblemDto): Promise<ReturnProblemDto> {
    const problem = await this.createProblemUseCase.execute(createProblemDto);

    return ReturnProblemDto.fromEntity(problem);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<ReturnProblemListDto> {
    const page = paginationQueryDto.page || 1;
    const limit = paginationQueryDto.limit || 10;
    const [problems, count] = await this.findAllProblemUseCase.execute(
      page,
      limit,
    );

    const totalPages = Math.ceil(count / limit);
    return ReturnProblemListDto.fromEntity(problems, page, limit, totalPages);
  }

  async findOneById(id: number): Promise<ReturnProblemDto> {
    const problem = await this.findProblemByIdUseCase.execute(id);

    return ReturnProblemDto.fromEntity(problem);
  }

  async findProblemEntityById(id: number): Promise<Problem> {
    return await this.findProblemByIdUseCase.execute(id);
  }

  async findOneByTitle(title: string): Promise<ReturnProblemDto> {
    const problem = await this.findProblemByTitleUseCase.execute(title);

    return ReturnProblemDto.fromEntity(problem);
  }

  async update(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<ReturnProblemDto> {
    const problem = await this.updateProblemUseCase.execute(
      id,
      updateProblemDto,
    );

    return ReturnProblemDto.fromEntity(problem);
  }

  async remove(id: number): Promise<void> {
    await this.removeProblemUseCase.execute(id);
  }
}
