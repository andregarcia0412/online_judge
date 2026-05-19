import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';
import { Submission } from '../entities/submission.entity';

@Injectable()
export class FindOneSubmissionByIdUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(id: string): Promise<Submission> {
    const submission = await this.submissionRepository.findOneById(id);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }
}
