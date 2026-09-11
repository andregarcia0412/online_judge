import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthServicePort } from './interface/auth.service.port';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthServicePort)
    private readonly authService: AuthServicePort,
  ) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() LoginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(LoginDto);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  @ApiOkResponse({ type: AuthResponseDto })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.refresh(refreshTokenDto);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('/register')
  @ApiCreatedResponse({ type: AuthResponseDto })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.register(createUserDto);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/logout')
  @ApiNoContentResponse()
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    await this.authService.revokeSession(refreshTokenDto);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/forgot-password')
  @ApiNoContentResponse()
  async forgotPassword(
    @Body() passwordResetRequestDto: PasswordResetRequestDto,
  ): Promise<void> {
    await this.authService.requestPasswordReset(passwordResetRequestDto);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/reset-password')
  @ApiNoContentResponse()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
  }
}
