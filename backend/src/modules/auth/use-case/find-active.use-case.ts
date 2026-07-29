import { Inject, Injectable } from '@nestjs/common';
import { PasswordResetCodeRepositoryPort } from '../interface/password-code.repository.port';
import { PasswordResetCode } from '../entities/password-reset-code.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FindActivePasswordResetCodeUseCase {
  constructor(
    @Inject(PasswordResetCodeRepositoryPort)
    private readonly passwordCodeRepository: PasswordResetCodeRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(userId: string): Promise<PasswordResetCode | null> {
    return await this.passwordCodeRepository.findActive(
      userId,
      this.configService.getOrThrow('MAX_RESET_PASSWORD_TRIES'),
    );
  }
}
