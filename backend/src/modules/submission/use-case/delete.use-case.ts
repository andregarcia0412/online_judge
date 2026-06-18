import { Inject, Injectable } from '@nestjs/common';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';

@Injectable()
export class DeleteSubmissionUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    await this.submissionRepository.remove(id);
  }
}
