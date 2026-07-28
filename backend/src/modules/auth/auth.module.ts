import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { BcryptProvider } from 'src/shared/provider/hash/bcrypt.provider';
import { HashProviderPort } from 'src/shared/provider/hash/hash.provider.port';
import { EmailSenderProvider } from 'src/shared/provider/mail/email-sender.provider';
import { EmailSenderProviderPort } from 'src/shared/provider/mail/email-sender.provider.port';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './common/jwt.strategy';
import { PasswordResetCode } from './entities/password-reset-code.entity';
import { AuthServicePort } from './interface/auth.service.port';
import { PasswordResetCodeRepositoryPort } from './interface/password-code.repository.port';
import { JwtProvider } from './provider/jwt.provider';
import { JwtProviderPort } from './provider/jwt.provider.port';
import { PasswordResetCodeRepository } from './repository/password-code.repository';
import { FindActivePasswordResetCodeUseCase } from './use-case/find-active.use-case';
import { GeneratePasswordResetCodeUseCase } from './use-case/generate-code.use-case';
import { IncrementAttemptsUseCase } from './use-case/increment-attempts.use-case';
import { InvalidateAllUseCase } from './use-case/invalidate-all.use-case';
import { MarkAsUsedUseCase } from './use-case/mark-used.use-case';
import { ValidateCodeUseCase } from './use-case/validate-code.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetCode]), UserModule],
  controllers: [AuthController],
  providers: [
    { provide: AuthServicePort, useClass: AuthService },
    { provide: JwtProviderPort, useClass: JwtProvider },
    { provide: HashProviderPort, useClass: BcryptProvider },
    { provide: EmailSenderProviderPort, useClass: EmailSenderProvider },
    {
      provide: PasswordResetCodeRepositoryPort,
      useClass: PasswordResetCodeRepository,
    },
    JwtStrategy,
    FindActivePasswordResetCodeUseCase,
    GeneratePasswordResetCodeUseCase,
    IncrementAttemptsUseCase,
    InvalidateAllUseCase,
    MarkAsUsedUseCase,
    ValidateCodeUseCase,
  ],
})
export class AuthModule {}
