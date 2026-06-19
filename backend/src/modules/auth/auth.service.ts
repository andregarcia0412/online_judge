import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { UserServicePort } from 'src/modules/user/interface/user.service.port';
import { HashProviderPort } from 'src/shared/provider/hash/hash.provider.port';
import { UserRepositoryPort } from '../user/interface/user.repository.port';
import { AuthResponseDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { AuthServicePort } from './interface/auth.service.port';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(HashProviderPort)
    private readonly hashProvider: HashProviderPort,
    @Inject(UserServicePort)
    private readonly userService: UserServicePort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async getTokens(
    userId: string,
    email: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_EXPIRATION_TIME',
          ) as any,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          ) as any,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOneByEmail(loginDto.email);

    if (
      !user ||
      !(await this.hashProvider.compare(loginDto.password, user.password))
    ) {
      throw new BadRequestException('Incorrect email or password');
    }

    await this.userService.updateUserStreak(user);

    const tokens = await this.getTokens(user.id, user.email);

    const returnUser: ReturnUserDto = ReturnUserDto.fromEntity(user);

    return new AuthResponseDto(
      tokens.access_token,
      tokens.refresh_token,
      returnUser,
    );
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<RefreshResponseDto> {
    try {
      const refreshToken = refreshTokenDto.refreshToken;
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.userRepository.findOneById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      const tokens = await this.getTokens(user.id, user.email);

      return new RefreshResponseDto(tokens.access_token, tokens.refresh_token);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  register(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return this.userService.create(createUserDto);
  }
}
