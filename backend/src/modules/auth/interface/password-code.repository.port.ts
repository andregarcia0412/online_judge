import { PasswordResetCode } from '../entities/password-reset-code.entity';

export interface PasswordResetCodeRepositoryPort {
  save(userId: string, codeHash: string): Promise<PasswordResetCode>;
  findActive(
    userId: string,
    maxAttempts: number,
  ): Promise<PasswordResetCode | null>;
  invalidateAll(userId: string): Promise<void>;
  incrementAttempts(id: string): Promise<void>;
  markAsUsed(userId: string): Promise<boolean>;
}

export const PasswordResetCodeRepositoryPort = Symbol(
  'PasswordResetCodeRepositoryPort',
);
