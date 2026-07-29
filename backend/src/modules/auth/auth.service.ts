import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UserServicePort } from 'src/modules/user/interface/user.service.port';
import { HashProviderPort } from 'src/shared/provider/hash/hash.provider.port';
import { EmailSenderProviderPort } from 'src/shared/provider/mail/email-sender.provider.port';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthServicePort } from './interface/auth.service.port';
import { JwtProviderPort } from './provider/jwt.provider.port';
import { FindActivePasswordResetCodeUseCase } from './use-case/find-active.use-case';
import { GeneratePasswordResetCodeUseCase } from './use-case/generate-code.use-case';
import { IncrementAttemptsUseCase } from './use-case/increment-attempts.use-case';
import { InvalidateAllUseCase } from './use-case/invalidate-all.use-case';
import { MarkAsUsedUseCase } from './use-case/mark-used.use-case';
import { ValidateCodeUseCase } from './use-case/validate-code.use-case';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    @Inject(HashProviderPort)
    private readonly hashProvider: HashProviderPort,
    @Inject(UserServicePort)
    private readonly userService: UserServicePort,
    @Inject(JwtProviderPort)
    private readonly jwtProvider: JwtProviderPort,
    @Inject(EmailSenderProviderPort)
    private readonly emailSenderProvider: EmailSenderProviderPort,
    @Inject(FindActivePasswordResetCodeUseCase)
    private readonly findActivePasswordResetCodeUseCase: FindActivePasswordResetCodeUseCase,
    @Inject(GeneratePasswordResetCodeUseCase)
    private readonly generatePasswordResetCodeUseCase: GeneratePasswordResetCodeUseCase,
    @Inject(IncrementAttemptsUseCase)
    private readonly incrementAttemptsUseCase: IncrementAttemptsUseCase,
    @Inject(InvalidateAllUseCase)
    private readonly invalidateAllUseCase: InvalidateAllUseCase,
    @Inject(MarkAsUsedUseCase)
    private readonly markAsUsedUseCase: MarkAsUsedUseCase,
    @Inject(ValidateCodeUseCase)
    private readonly validateCodeUseCase: ValidateCodeUseCase,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findOneByEmail(loginDto.email);

    if (
      !user ||
      !(await this.hashProvider.compare(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    await this.userService.updateUserStreak(user);

    return this.generateTokens(user.id);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const payload = this.jwtProvider.verifyRefreshToken(
      refreshTokenDto.refreshToken,
    );

    const sub = typeof payload === 'string' ? payload : payload.sub;
    if (!sub) throw new UnauthorizedException('Invalid refresh token');

    try {
      await this.userService.findOneById(sub);
    } catch (e) {
      if (e instanceof NotFoundException) throw new UnauthorizedException();
      throw e;
    }

    return this.generateTokens(sub);
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.userService.create(createUserDto);

    return this.generateTokens(user.id);
  }

  async requestPasswordReset(
    passwordResetDto: PasswordResetRequestDto,
  ): Promise<void> {
    const user = await this.userService.findOneByEmail(passwordResetDto.email);
    if (!user) return;

    const recent = await this.findActivePasswordResetCodeUseCase.execute(
      user.id,
    );

    if (recent && Date.now() - recent.createdAt.getTime() < 60000) return;

    await this.invalidateAllUseCase.execute(user.id);

    const code = await this.generatePasswordResetCodeUseCase.execute(user.id);

    await this.emailSenderProvider.send({
      to: user.email,
      subject: 'Online Judge Password Reset',
      html: this.renderResetCodeEmail(user.username, code, 10),
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userService.findOneByEmail(resetPasswordDto.email);
    if (!user) throw new BadRequestException('Invalid or expired reset code');

    const entry = await this.findActivePasswordResetCodeUseCase.execute(
      user.id,
    );
    if (!entry) throw new BadRequestException('Invalid or expired reset code');

    await this.incrementAttemptsUseCase.execute(entry.id);

    if (
      !(await this.validateCodeUseCase.execute(user.id, resetPasswordDto.code))
    )
      throw new BadRequestException('Invalid or expired reset code');

    const consumed = await this.markAsUsedUseCase.execute(user.id);
    if (!consumed)
      throw new BadRequestException('Invalid or expired reset code');

    await this.userService.update(user.id, {
      password: await this.hashProvider.generateHash(resetPasswordDto.password),
    });
  }

  private generateTokens(userId: string): AuthResponseDto {
    return new AuthResponseDto(
      this.jwtProvider.generateAccessToken(userId),
      this.jwtProvider.generateRefreshToken(userId),
    );
  }

  private renderResetCodeEmail(
    name: string,
    code: string,
    minutes: number,
  ): string {
    return `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif">
      <tr><td align="center" style="padding:32px 16px">
        <p style="font-size:16px;color:#333">Hi, ${name}.</p>
        <p style="font-size:16px;color:#333">Use the code below to reset your password:</p>
        <p style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#111;margin:24px 0">${code}</p>
        <p style="font-size:14px;color:#666">It expires in ${minutes} minutes.</p>
        <p style="font-size:14px;color:#666">If you didn't request this, you can safely ignore this email.</p>
      </td></tr>
    </table>`;
  }
}
