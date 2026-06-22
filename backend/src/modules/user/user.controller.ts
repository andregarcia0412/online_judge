import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
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
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserServicePort } from './interface/user.service.port';
import { JwtAuthGuard } from '../auth/common/jwt-auth.guard';
import { GetUser } from 'src/shared/decorator/get-user.decorator';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserServicePort)
    private readonly userService: UserServicePort,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ReturnUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return await this.userService.create(createUserDto);
  }

  @Get(':id/submission')
  @ApiOkResponse({ type: [ReturnSubmissionDto] })
  async findAllSubmissionsById(
    @Param('id') id: string,
  ): Promise<ReturnSubmissionDto[]> {
    return await this.userService.findAllSubmissionsById(id);
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

  @Patch(':id')
  @ApiOkResponse({ type: ReturnUserDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
