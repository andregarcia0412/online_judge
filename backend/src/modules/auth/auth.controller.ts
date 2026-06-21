import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { AuthServicePort } from './interface/auth.service.port';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthServicePort)
    private readonly authService: AuthServicePort,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() LoginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(LoginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBearerAuth('refresh-token')
  refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('/register')
  @ApiCreatedResponse({ type: ReturnUserDto })
  register(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return this.authService.register(createUserDto);
  }
}
