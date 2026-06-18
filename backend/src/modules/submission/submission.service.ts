import { Injectable } from '@nestjs/common';
import { TestResult } from '../test-runner/dto/test-result.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReturnSubmissionDto } from './dto/return-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { CreatePlaygroundSubmissionUseCase } from './use-case/create-playground.use-case';
import { CreateSubmissionUseCase } from './use-case/create.use-case';
import { DeleteSubmissionUseCase } from './use-case/delete.use-case';
import { FindAllSubmissionByUserIdUseCase } from './use-case/find-all-by-user-id.use-case';
import { FindAllSubmissionUseCase } from './use-case/find-all.use-case';
import { FindOneSubmissionByIdUseCase } from './use-case/find-one-by-id.use-case';
import { UpdateSubmissionUseCase } from './use-case/update.use-case';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly createSubmissionUseCase: CreateSubmissionUseCase,
    private readonly createPlaygroundSubmissionUseCase: CreatePlaygroundSubmissionUseCase,
    private readonly findAllSubmissionUseCase: FindAllSubmissionUseCase,
    private readonly findOneSubmissionByIdUseCase: FindOneSubmissionByIdUseCase,
    private readonly findAllSubmissionByUserIdUseCase: FindAllSubmissionByUserIdUseCase,
    private readonly updateSubmissionUseCase: UpdateSubmissionUseCase,
    private readonly deleteSubmissionUseCase: DeleteSubmissionUseCase,
  ) {}

  async create(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<ReturnSubmissionDto> {
    return await this.createSubmissionUseCase.execute(createSubmissionDto);
  }

  async createPlaygroundSubmission(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<TestResult> {
    return await this.createPlaygroundSubmissionUseCase.execute(
      createSubmissionDto,
    );
  }

  async findAll() {
    return (await this.findAllSubmissionUseCase.execute()).map(
      ReturnSubmissionDto.fromEntity,
    );
  }

  async findOneById(id: string): Promise<ReturnSubmissionDto> {
    return ReturnSubmissionDto.fromEntity(
      await this.findOneSubmissionByIdUseCase.execute(id),
    );
  }

  async findAllByUserId(id_user: string): Promise<ReturnSubmissionDto[]> {
    return (await this.findAllSubmissionByUserIdUseCase.execute(id_user)).map(
      ReturnSubmissionDto.fromEntity,
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
