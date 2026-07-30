import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserServicePort } from 'src/modules/user/interface/user.service.port';
import { AuthenticatedUser } from 'src/shared/interface/authenticated-user.interface';

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

  async validate(payload: { sub: string }): Promise<AuthenticatedUser> {
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
