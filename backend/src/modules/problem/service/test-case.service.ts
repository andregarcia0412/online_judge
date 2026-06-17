import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateTestCaseDto } from '../dto/test-case/create-test-case.dto';
import { ReturnTestCaseDto } from '../dto/test-case/return-test-case.dto';
import { UpdateTestCaseDto } from '../dto/test-case/update-test-case.dto';
import { FindAllTestCasesByProblemIdUseCase } from '../use-case/test-case/find-all-by-problem-id.use-case';
import { CreateTestCaseUseCase } from '../use-case/test-case/create.use-case';
import { FindAllTestCasesUseCase } from '../use-case/test-case/find-all.use-case';
import { FindTestCaseByIdUseCase } from '../use-case/test-case/find-one.use-case';
import { RemoveTestCaseUseCase } from '../use-case/test-case/remove.use-case';
import { UpdateTestCaseUseCase } from '../use-case/test-case/update.use-case';

@Injectable()
export class TestCaseService {
  constructor(
    @Inject(CreateTestCaseUseCase)
    private readonly createTestCaseUseCase: CreateTestCaseUseCase,
    @Inject(FindAllTestCasesByProblemIdUseCase)
    private readonly findAllTestCasesByProblemIdUseCase: FindAllTestCasesByProblemIdUseCase,
    @Inject(FindAllTestCasesUseCase)
    private readonly findAllTestCasesUseCase: FindAllTestCasesUseCase,
    @Inject(FindTestCaseByIdUseCase)
    private readonly findTestCaseByIdUseCase: FindTestCaseByIdUseCase,
    @Inject(RemoveTestCaseUseCase)
    private readonly removeTestCaseUseCase: RemoveTestCaseUseCase,
    @Inject(UpdateTestCaseUseCase)
    private readonly updateTestCaseUseCase: UpdateTestCaseUseCase,
  ) {}

  async create(
    createTestCaseDto: CreateTestCaseDto,
  ): Promise<ReturnTestCaseDto> {
    return ReturnTestCaseDto.fromEntity(
      await this.createTestCaseUseCase.execute(createTestCaseDto),
    );
  }

  async findAll(): Promise<ReturnTestCaseDto[]> {
    return ReturnTestCaseDto.fromEntityList(
      await this.findAllTestCasesUseCase.execute(),
    );
  }

  async findOneById(id: string): Promise<ReturnTestCaseDto> {
    return ReturnTestCaseDto.fromEntity(
      await this.findTestCaseByIdUseCase.execute(id),
    );
  }

  async findAllByProblemId(id_problem: number): Promise<ReturnTestCaseDto[]> {
    return ReturnTestCaseDto.fromEntityList(
      await this.findAllTestCasesByProblemIdUseCase.execute(id_problem),
    );
  }

  async update(
    id: string,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<UpdateResult> {
    return await this.updateTestCaseUseCase.execute(id, updateTestCaseDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.removeTestCaseUseCase.execute(id);
  }
}
