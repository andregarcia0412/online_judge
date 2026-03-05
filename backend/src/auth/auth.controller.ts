import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ReturnUserDto } from 'src/user/dto/return-user.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiCreatedResponse({ type: AuthResponseDto })
  login(@Body() LoginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(LoginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  @ApiCreatedResponse({ type: RefreshResponseDto })
  @ApiBearerAuth('refresh-token')
  refresh(
    @Body('refresh_token') refreshToken: string,
  ): Promise<RefreshResponseDto> {
    return this.authService.refresh(refreshToken);
  }

  @Post('/register')
  @ApiCreatedResponse({ type: ReturnUserDto })
  register(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return this.authService.register(createUserDto);
  }
}
