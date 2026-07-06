import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../interface/user.repository.port';
import { User } from '../entities/user.entity';

@Injectable()
export class UpdateUserStreakUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(user: User): Promise<void> {
    const oldUserStreak = user.streak;

    if (!user.lastSubmissionDate) {
      user.streak = 0;
    } else {
      const lastDate = new Date(user.lastSubmissionDate);
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
