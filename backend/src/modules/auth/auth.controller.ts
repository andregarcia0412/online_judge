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
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthServicePort } from './interface/auth.service.port';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthServicePort)
    private readonly authService: AuthServicePort,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() LoginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(LoginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  @ApiOkResponse({ type: AuthResponseDto })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.refresh(refreshTokenDto);
  }

  @Post('/register')
  @ApiCreatedResponse({ type: AuthResponseDto })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/forgot-password')
  @ApiNoContentResponse()
  async forgotPassword(
    @Body() passwordResetRequestDto: PasswordResetRequestDto,
  ): Promise<void> {
    await this.authService.requestPasswordReset(passwordResetRequestDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/reset-password')
  @ApiNoContentResponse()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
  }
}
