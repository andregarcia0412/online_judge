import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ReturnUserDto } from './dto/return-user.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: ReturnUserDto })
  create(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return this.userService.create(createUserDto);
  }

  @Get(':id/submission')
  @ApiOkResponse({ type: [ReturnSubmissionDto] })
  findAllSubmissionsById(
    @Param('id') id: string,
  ): Promise<ReturnSubmissionDto[]> {
    return this.userService.findAllSubmissionsById(id);
  }

  @Get(':id')
  @ApiOkResponse({ type: ReturnUserDto })
  findOne(@Param('id') id: string): Promise<ReturnUserDto> {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateResult })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UpdateResult })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.remove(id);
  }
}
