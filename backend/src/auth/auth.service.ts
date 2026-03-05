import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ReturnUserDto } from 'src/user/dto/return-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthResponseDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { RefreshToken } from './entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async getTokens(userId: string, email: string) {
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

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new BadRequestException('Incorrect email or password');
    }

    const tokens = await this.getTokens(user.id, user.email);

    const hashedToken = await bcrypt.hash(tokens.refresh_token, 10);

    await this.refreshTokenRepository.delete({ id_user: user.id });

    const newRefreshToken = this.refreshTokenRepository.create({
      id_user: user.id,
      expires_in: this.configService.get<string>(
        'JWT_REFRESH_EXPIRATION_TIME',
      ) as any,
      token: hashedToken,
    });

    await this.refreshTokenRepository.save(newRefreshToken);

    const returnUser: ReturnUserDto = new ReturnUserDto(
      user.id,
      user.email,
      user.username,
      user.points,
      user.total_submissions,
      user.total_resolved,
      user.streak,
      user.creation_date,
    );

    return new AuthResponseDto(
      tokens.access_token,
      tokens.refresh_token,
      this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME') as any,
      returnUser,
    );
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UnauthorizedException('Access Denied: User does not exist');
    }

    const oldToken = await this.refreshTokenRepository.findOneBy({
      id_user: userId,
    });

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      oldToken?.token,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied: Token Expired');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.refreshTokenRepository.update(
      { id_user: user.id },
      { token: await bcrypt.hash(tokens.refresh_token, 10) },
    );

    return new RefreshResponseDto(tokens.access_token, tokens.refresh_token);
  }
}
