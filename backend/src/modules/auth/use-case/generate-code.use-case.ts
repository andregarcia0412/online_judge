import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomInt } from 'crypto';
import { PasswordResetCodeRepositoryPort } from '../interface/password-code.repository.port';

@Injectable()
export class GeneratePasswordResetCodeUseCase {
  constructor(
    @Inject(PasswordResetCodeRepositoryPort)
    private readonly passwordCodeRepository: PasswordResetCodeRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(userId: string): Promise<string> {
    const code = randomInt(0, 1000000).toString().padStart(6, '0');

    await this.passwordCodeRepository.save(
      userId,
      this.computeHash(userId, code),
    );

    return code;
  }

  private computeHash(userId: string, code: string): string {
    return createHmac(
      'sha256',
      this.configService.getOrThrow('PASSWORD_RESET_SECRET'),
    )
      .update(`${userId}:${code}`)
      .digest('hex');
  }
}
