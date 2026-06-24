import { Inject, Injectable } from '@nestjs/common';
import { SubmissionRepositoryPort } from '../interface/submission.repository.port';
import { Submission } from '../entities/submission.entity';

@Injectable()
export class FindAllSubmissionByUserIdUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(idUser: string): Promise<Submission[]> {
    return await this.submissionRepository.findAllByUserId(idUser);
  }
}
