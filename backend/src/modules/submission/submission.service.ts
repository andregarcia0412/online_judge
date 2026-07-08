import { Inject, Injectable } from '@nestjs/common';
import { TestResult } from '../test-runner/dto/test-result.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReturnSubmissionDto } from './dto/return-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { SubmissionServicePort } from './interface/submission.service.port';
import { CreatePlaygroundSubmissionUseCase } from './use-case/create-playground.use-case';
import { CreateSubmissionUseCase } from './use-case/create.use-case';
import { DeleteSubmissionUseCase } from './use-case/delete.use-case';
import { FindAllSubmissionByUserIdUseCase } from './use-case/find-all-by-user-id.use-case';
import { FindAllSubmissionUseCase } from './use-case/find-all.use-case';
import { FindOneSubmissionByIdUseCase } from './use-case/find-one-by-id.use-case';
import { UpdateSubmissionUseCase } from './use-case/update.use-case';

@Injectable()
export class SubmissionService implements SubmissionServicePort {
  constructor(
    @Inject(CreateSubmissionUseCase)
    private readonly createSubmissionUseCase: CreateSubmissionUseCase,
    @Inject(CreatePlaygroundSubmissionUseCase)
    private readonly createPlaygroundSubmissionUseCase: CreatePlaygroundSubmissionUseCase,
    @Inject(FindAllSubmissionUseCase)
    private readonly findAllSubmissionUseCase: FindAllSubmissionUseCase,
    @Inject(FindOneSubmissionByIdUseCase)
    private readonly findOneSubmissionByIdUseCase: FindOneSubmissionByIdUseCase,
    @Inject(FindAllSubmissionByUserIdUseCase)
    private readonly findAllSubmissionByUserIdUseCase: FindAllSubmissionByUserIdUseCase,
    @Inject(UpdateSubmissionUseCase)
    private readonly updateSubmissionUseCase: UpdateSubmissionUseCase,
    @Inject(DeleteSubmissionUseCase)
    private readonly deleteSubmissionUseCase: DeleteSubmissionUseCase,
  ) {}

  async create(
    userId: string,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<ReturnSubmissionDto> {
    return await this.createSubmissionUseCase.execute(
      userId,
      createSubmissionDto,
    );
  }

  async createPlaygroundSubmission(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<TestResult> {
    return await this.createPlaygroundSubmissionUseCase.execute(
      createSubmissionDto,
    );
  }

  async findAll(): Promise<ReturnSubmissionDto[]> {
    return (await this.findAllSubmissionUseCase.execute()).map((submission) =>
      ReturnSubmissionDto.fromEntity(submission),
    );
  }

  async findOneById(id: string): Promise<ReturnSubmissionDto> {
    return ReturnSubmissionDto.fromEntity(
      await this.findOneSubmissionByIdUseCase.execute(id),
    );
  }

  async findAllByUserId(idUser: string): Promise<ReturnSubmissionDto[]> {
    return (await this.findAllSubmissionByUserIdUseCase.execute(idUser)).map(
      (submission) => ReturnSubmissionDto.fromEntity(submission),
    );
  }

  async update(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<ReturnSubmissionDto> {
    return ReturnSubmissionDto.fromEntity(
      await this.updateSubmissionUseCase.execute(id, updateSubmissionDto),
    );
  }

  async remove(id: string): Promise<void> {
    await this.deleteSubmissionUseCase.execute(id);
  }
}
