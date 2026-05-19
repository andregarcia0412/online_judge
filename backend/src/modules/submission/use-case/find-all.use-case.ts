import { Inject, Injectable } from '@nestjs/common';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';
import { Submission } from '../entities/submission.entity';

@Injectable()
export class FindAllSubmissionUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(): Promise<Submission[]> {
    return await this.submissionRepository.findAll();
  }
}
