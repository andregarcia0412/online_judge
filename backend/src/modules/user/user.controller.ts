import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/common/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserServicePort } from './interface/user.service.port';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserServicePort)
    private readonly userService: UserServicePort,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ReturnUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return await this.userService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReturnUserDto })
  async findCurrentUser(
    @GetUser('userId') userId: string,
  ): Promise<ReturnUserDto> {
    return await this.userService.findOneById(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReturnUserDto })
  async update(
    @GetUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    return await this.userService.update(userId, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  async remove(@GetUser('userId') userId: string): Promise<void> {
    await this.userService.remove(userId);
  }
}
