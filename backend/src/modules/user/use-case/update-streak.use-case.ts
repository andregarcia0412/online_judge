import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../interface/user.repository.port';
import { User } from '../entities/user.entity';
import { SubmissionRepositoryPort } from 'src/modules/submission/interface/submission.repository.port';

@Injectable()
export class UpdateUserStreakUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(SubmissionRepositoryPort)
    private readonly submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(user: User) {
    const lastUserSubmission =
      await this.submissionRepository.findLastUserSubmission(user.id);
    const oldUserStreak = user.streak;

    if (!lastUserSubmission) {
      user.streak = 0;
    } else {
      const lastDate = new Date(lastUserSubmission.submissionDate);
      const today = new Date();

      lastDate.setUTCHours(0, 0, 0, 0);
      today.setUTCHours(0, 0, 0, 0);

      const diffDays = this.getDiffDays(today, lastDate);

      if (diffDays > 1) {
        user.streak = 0;
      }
    }
    const newUserStreak = user.streak;
    if (oldUserStreak !== newUserStreak) {
      await this.userRepository.saveExistingEntity(user);
    }
  }

  private getDiffDays(today: Date, lastDate: Date): number {
    return Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }
}
