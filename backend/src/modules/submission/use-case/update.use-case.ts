import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSubmissionDto } from '../dto/update-submission.dto';
import { Submission } from '../entities/submission.entity';
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
  ): Promise<Submission> {
    const updatedSubmission = await this.submissionRepository.updateById(
      id,
      updateSubmissionDto,
    );

    if (!updatedSubmission) {
      throw new NotFoundException('Submission not found');
    }

    return updatedSubmission;
  }
}
