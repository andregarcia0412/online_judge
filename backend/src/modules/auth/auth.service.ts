import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthResponseDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    const user = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
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

  async refresh(refreshToken: string): Promise<RefreshResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.userRepository.findOneBy({ id: payload.sub });

      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      const tokens = await this.getTokens(user.id, user.email);

      return new RefreshResponseDto(tokens.access_token, tokens.refresh_token);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  register(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return this.userService.create(createUserDto);
  }
}
