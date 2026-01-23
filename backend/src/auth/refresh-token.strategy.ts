import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
    const tokenInDb = await this.refreshTokenRepository.findOneBy({
      id_user: payload.sub,
    });

    if (!tokenInDb) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const matches = await bcrypt.compare(refreshToken, tokenInDb.token);

    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return {
      ...payload,
      refreshToken,
    };
  }
}
