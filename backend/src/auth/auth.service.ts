import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthResponseDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ReturnUserDto } from 'src/user/dto/return-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new BadRequestException('Incorrect email or password');
    }

    const payload = { sub: user.id_user, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_EXPIRATION_TIME'),
    });

    const returnUser: ReturnUserDto = new ReturnUserDto(
      user.id_user,
      user.email,
      user.username,
      user.points,
      user.total_submissions,
      user.total_resolved,
      user.streak,
      user.creation_date,
    );

    return new AuthResponseDto(
      token,
      this.configService.get<number>('JWT_EXPIRATION_TIME')!,
      returnUser,
    );
  }
}
