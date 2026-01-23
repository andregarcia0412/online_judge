import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { RefreshResponseDto } from './dto/refresh-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiCreatedResponse({ type: AuthResponseDto })
  login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  @ApiCreatedResponse({ type: RefreshResponseDto })
  @ApiBearerAuth('refresh-token')
  refresh(@Req() req: Request & { user: any }) {
    const user = req.user;
    return this.authService.refresh(user['sub'], user['refreshToken']);
  }
}
