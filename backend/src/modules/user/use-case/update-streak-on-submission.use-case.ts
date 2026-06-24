import { Inject, Injectable } from '@nestjs/common';
import { SubmissionRepositoryPort } from 'src/modules/submission/interface/submission.repository.port';
import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UpdateUserStreakOnSubmissionUseCase {
  constructor(
    @Inject(SubmissionRepositoryPort)
    private readonly submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(user: User, manager?: EntityManager) {
    const lastUserSubmission =
      await this.submissionRepository.findLastUserSubmission(user.id, manager);

    if (!lastUserSubmission) {
      user.streak = 1;
    } else {
      const lastDate = new Date(lastUserSubmission.submissionDate);
      const today = new Date();

      lastDate.setUTCHours(0, 0, 0, 0);
      today.setUTCHours(0, 0, 0, 0);

      const diffDays = this.getDiffDays(today, lastDate);

      if (diffDays === 0) return;

      if (diffDays === 1) {
        user.streak = Number(user.streak) + 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    }
  }

  private getDiffDays(today: Date, lastDate: Date): number {
    return Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }
}
