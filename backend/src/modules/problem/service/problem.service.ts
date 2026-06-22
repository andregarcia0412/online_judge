import { Inject, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { ReturnCategoryDto } from '../dto/category/return-category.dto';
import { CreateProblemDto } from '../dto/problem/create-problem.dto';
import { ReturnProblemDto } from '../dto/problem/return-problem.dto';
import { UpdateProblemDto } from '../dto/problem/update-problem.dto';
import { ReturnTestCaseDto } from '../dto/test-case/return-test-case.dto';
import { ProblemServicePort } from '../interface/service/problem.service.port';
import { CreateProblemUseCase } from '../use-case/problem/create.use-case';
import { FindAllProblemUseCase } from '../use-case/problem/find-all.use-case';
import { FindProblemByIdUseCase } from '../use-case/problem/find-by-id.use-case';
import { FindProblemByTitleUseCase } from '../use-case/problem/find-by-title.use-case';
import { RemoveProblemUseCase } from '../use-case/problem/remove.use-case';
import { UpdateProblemUseCase } from '../use-case/problem/update.use-case';

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
    const createResponse =
      await this.createProblemUseCase.execute(createProblemDto);

    return ReturnProblemDto.fromEntity(
      createResponse.problem,
      ReturnCategoryDto.fromEntityList(createResponse.categories),
      ReturnTestCaseDto.fromEntityList(createResponse.testCases),
    );
  }

  async findAll(): Promise<ReturnProblemDto[]> {
    const problems = await this.findAllProblemUseCase.execute();

    return problems.map((problem) =>
      ReturnProblemDto.fromEntity(
        problem.problem,
        ReturnCategoryDto.fromEntityList(problem.categories),
        ReturnTestCaseDto.fromEntityList(problem.testCases),
      ),
    );
  }

  async findOneById(id: number): Promise<ReturnProblemDto> {
    const problemResponse = await this.findProblemByIdUseCase.execute(id);

    return ReturnProblemDto.fromEntity(
      problemResponse.problem,
      ReturnCategoryDto.fromEntityList(problemResponse.categories),
      ReturnTestCaseDto.fromEntityList(problemResponse.testCases),
    );
  }

  async findOneByTitle(title: string): Promise<ReturnProblemDto> {
    const problemResponse = await this.findProblemByTitleUseCase.execute(title);

    return ReturnProblemDto.fromEntity(
      problemResponse.problem,
      ReturnCategoryDto.fromEntityList(problemResponse.categories),
      ReturnTestCaseDto.fromEntityList(problemResponse.testCases),
    );
  }

  async update(
    id: number,
    updateProblemDto: UpdateProblemDto,
  ): Promise<UpdateResult> {
    return await this.updateProblemUseCase.execute(id, updateProblemDto);
  }

  async remove(id: number): Promise<void> {
    await this.removeProblemUseCase.execute(id);
  }
}
