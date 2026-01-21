import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiCreatedResponse({ type: AuthResponseDto })
  create(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }
}
