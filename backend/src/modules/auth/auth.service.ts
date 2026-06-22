import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { UserServicePort } from 'src/modules/user/interface/user.service.port';
import { HashProviderPort } from 'src/shared/provider/hash/hash.provider.port';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthServicePort } from './interface/auth.service.port';
import { JwtProviderPort } from './provider/jwt.provider.port';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    @Inject(HashProviderPort)
    private readonly hashProvider: HashProviderPort,
    @Inject(UserServicePort)
    private readonly userService: UserServicePort,
    @Inject(JwtProviderPort)
    private readonly jwtProvider: JwtProviderPort,
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

  async getUserData(userId: string): Promise<ReturnUserDto> {
    return await this.userService.findOneById(userId);
  }

  private generateTokens(userId: string): AuthResponseDto {
    return new AuthResponseDto(
      this.jwtProvider.generateAccessToken(userId),
      this.jwtProvider.generateRefreshToken(userId),
    );
  }
}
