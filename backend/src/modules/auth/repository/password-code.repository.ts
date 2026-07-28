import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { PasswordResetCode } from '../entities/password-reset-code.entity';
import { PasswordResetCodeRepositoryPort } from '../interface/password-code.repository.port';

@Injectable()
export class PasswordResetCodeRepository implements PasswordResetCodeRepositoryPort {
  constructor(
    @InjectRepository(PasswordResetCode)
    private readonly passwordCodeRepository: Repository<PasswordResetCode>,
  ) {}

  async save(userId: string, codeHash: string): Promise<PasswordResetCode> {
    const created = this.passwordCodeRepository.create({
      userId,
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60000),
      usedAt: null,
    });

    return await this.passwordCodeRepository.save(created);
  }
  async findActive(
    userId: string,
    maxAttempts: number,
  ): Promise<PasswordResetCode | null> {
    return this.passwordCodeRepository.findOne({
      where: {
        userId,
        usedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
        attempts: LessThan(maxAttempts),
      },
      order: { createdAt: 'DESC' },
    });
  }
  async invalidateAll(userId: string): Promise<void> {
    await this.passwordCodeRepository.update(
      { userId, usedAt: IsNull() },
      { expiresAt: new Date() },
    );
  }
  async incrementAttempts(id: string): Promise<void> {
    await this.passwordCodeRepository.increment({ id }, 'attempts', 1);
  }
  async markAsUsed(userId: string): Promise<boolean> {
    const result = await this.passwordCodeRepository.update(
      { userId, usedAt: IsNull() },
      { usedAt: new Date() },
    );
    return result.affected === 1;
  }
}
