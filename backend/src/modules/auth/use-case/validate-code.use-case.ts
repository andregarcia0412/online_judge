import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { PasswordResetCodeRepositoryPort } from '../interface/password-code.repository.port';

@Injectable()
export class ValidateCodeUseCase {
  constructor(
    @Inject(PasswordResetCodeRepositoryPort)
    private readonly passwordCodeRepository: PasswordResetCodeRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(userId: string, code: string): Promise<boolean> {
    const saved = await this.passwordCodeRepository.findActive(
      userId,
      this.configService.getOrThrow<number>('MAX_RESET_PASSWORD_TRIES'),
    );

    if (!saved) return false;

    const expected = Buffer.from(saved.codeHash, 'hex');
    const actual = Buffer.from(this.computeHash(userId, code), 'hex');

    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
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
