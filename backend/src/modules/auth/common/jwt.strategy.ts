import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserServicePort } from 'src/modules/user/interface/user.service.port';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(UserServicePort)
    private readonly userService: UserServicePort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: { sub: string }) {
    try {
      await this.userService.findOneById(payload.sub);
    } catch (e) {
      if (e instanceof NotFoundException)
        throw new UnauthorizedException('User no longer exists');
      throw e;
    }

    return { userId: payload.sub };
  }
}
