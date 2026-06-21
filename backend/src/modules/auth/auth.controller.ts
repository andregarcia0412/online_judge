import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
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
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { JwtAuthGuard } from './common/jwt-auth.guard';

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
  @ApiBearerAuth('refresh-token')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.refresh(refreshTokenDto);
  }

  @Post('/register')
  @ApiCreatedResponse({ type: ReturnUserDto })
  async register(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return await this.authService.register(createUserDto);
  }

  @Post('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ReturnUserDto })
  async getUserData(@GetUser('userId') userId: string) {
    return await this.authService.getUserData(userId);
  }
}
