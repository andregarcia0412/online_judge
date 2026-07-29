import { Inject, Injectable } from '@nestjs/common';
import { PasswordResetCodeRepositoryPort } from '../interface/password-code.repository.port';

@Injectable()
export class IncrementAttemptsUseCase {
  constructor(
    @Inject(PasswordResetCodeRepositoryPort)
    private readonly passwordCodeRepository: PasswordResetCodeRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    await this.passwordCodeRepository.incrementAttempts(id);
  }
}
