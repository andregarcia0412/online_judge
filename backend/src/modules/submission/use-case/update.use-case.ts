import { Inject, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { UpdateSubmissionDto } from '../dto/update-submission.dto';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';

@Injectable()
export class UpdateSubmissionUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private readonly submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<UpdateResult> {
    return await this.submissionRepository.updateById(id, updateSubmissionDto);
  }
}
