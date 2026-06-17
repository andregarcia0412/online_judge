import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';

@Injectable()
export class DeleteSubmissionUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(id: string): Promise<DeleteResult> {
    return await this.submissionRepository.delete(id);
  }
}
