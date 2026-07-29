import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtProviderPort, RefreshTokenPayload } from './jwt.provider.port';
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

  verifyRefreshToken(token: string): RefreshTokenPayload {
    let decoded: string | JwtPayload;
    try {
      decoded = verify(token, this.refreshSecret);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (
      typeof decoded === 'string' ||
      typeof decoded.sub !== 'string' ||
      typeof decoded.exp !== 'number' ||
      typeof decoded.iat !== 'number'
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return decoded as RefreshTokenPayload;
  }
}
