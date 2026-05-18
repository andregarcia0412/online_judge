import { Inject, Injectable } from '@nestjs/common';
import { Submission } from 'src/modules/submission/entities/submission.entity';
import { SubmissionRepositoryPort } from 'src/modules/submission/interface/submission.repository.port';

@Injectable()
export class FindAllSubmissionsUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private readonly submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(id: string): Promise<Submission[]> {
    return await this.submissionRepository.findAllByUserId(id);
  }
}
