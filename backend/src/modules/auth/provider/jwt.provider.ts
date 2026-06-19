import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtProviderPort } from './jwt.provider.port';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, sign, SignOptions, verify } from 'jsonwebtoken';

@Injectable()
export class JwtProvider implements JwtProviderPort {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(private readonly configService: ConfigService) {
    this.accessSecret =
      this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.accessExpiresIn = this.configService.getOrThrow<string>(
      'JWT_ACCESS_EXPIRATION_TIME',
    );
    this.refreshExpiresIn = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRATION_TIME',
    );
  }

  generateAccessToken(
    subject: string,
    payload: Record<string, any> = {},
  ): string {
    return sign({ ...payload }, this.accessSecret, {
      subject,
      expiresIn: this.accessExpiresIn as SignOptions['expiresIn'],
    });
  }
  generateRefreshToken(subject: string): string {
    return sign({}, this.refreshSecret, {
      subject,
      expiresIn: this.refreshExpiresIn as SignOptions['expiresIn'],
    });
  }
  verifyRefreshToken(token: string): string | JwtPayload {
    try {
      return verify(token, this.refreshSecret);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
