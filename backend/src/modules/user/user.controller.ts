import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { ReturnAvatarDto } from './dto/return-avatar.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseImagePipe } from 'src/shared/pipe/parse-image.pipe';

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

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['image'],
    },
  })
  @ApiCreatedResponse({ type: ReturnAvatarDto })
  async createAvatar(
    @GetUser('userId') userId: string,
    @UploadedFile(ParseImagePipe) file: Express.Multer.File,
  ): Promise<ReturnAvatarDto> {
    return await this.userService.createUserAvatar(userId, file);
  }

  @Get('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ReturnAvatarDto })
  async getAvatar(@GetUser('userId') userId: string): Promise<ReturnAvatarDto> {
    return await this.userService.getUserAvatar(userId);
  }
}
