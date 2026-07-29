import { Inject, Injectable } from '@nestjs/common';
import { PasswordResetCodeRepositoryPort } from '../interface/password-code.repository.port';

@Injectable()
export class MarkAsUsedUseCase {
  constructor(
    @Inject(PasswordResetCodeRepositoryPort)
    private readonly passwordCodeRepository: PasswordResetCodeRepositoryPort,
  ) {}

  async execute(userId: string): Promise<boolean> {
    return await this.passwordCodeRepository.markAsUsed(userId);
  }
}
