import { Inject, Injectable } from '@nestjs/common';
import { PasswordResetCodeRepositoryPort } from '../interface/password-code.repository.port';

@Injectable()
export class InvalidateAllUseCase {
  constructor(
    @Inject(PasswordResetCodeRepositoryPort)
    private readonly passwordCodeRepository: PasswordResetCodeRepositoryPort,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.passwordCodeRepository.invalidateAll(userId);
  }
}
