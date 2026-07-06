import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UpdateUserStreakOnSubmissionUseCase {
  execute(user: User): void {
    if (!user.lastSubmissionDate) {
      user.streak = 1;
    } else {
      const lastDate = new Date(user.lastSubmissionDate);
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
