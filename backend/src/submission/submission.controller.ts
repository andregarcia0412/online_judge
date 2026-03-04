import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ReturnSubmissionDto } from './dto/return-submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @ApiCreatedResponse({ type: ReturnSubmissionDto })
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @Get()
  @ApiCreatedResponse({ type: [ReturnSubmissionDto] })
  findAll() {
    return this.submissionService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: [ReturnSubmissionDto] })
  findOne(@Param('id_user') id_user: string) {
    return this.submissionService.findAllByUserId(id_user);
  }

  @Patch(':id')
  @ApiCreatedResponse()
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(id, updateSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }
}
