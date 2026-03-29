import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { TestResult } from '../test-runner/dto/test-result.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReturnSubmissionDto } from './dto/return-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @ApiCreatedResponse({ type: ReturnSubmissionDto })
  create(
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<CreateSubmissionDto> {
    return this.submissionService.create(createSubmissionDto);
  }

  @Post('/playground')
  @ApiCreatedResponse({ type: TestResult })
  async createPlaygroundSubmission(
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<TestResult> {
    return this.submissionService.createPlaygroundSubmission(
      createSubmissionDto,
    );
  }

  @Get()
  @ApiCreatedResponse({ type: [ReturnSubmissionDto] })
  findAll(): Promise<ReturnSubmissionDto[]> {
    return this.submissionService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ReturnSubmissionDto })
  findOne(@Param('id') id: string): Promise<ReturnSubmissionDto> {
    return this.submissionService.findOneById(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: UpdateResult })
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<UpdateResult> {
    return this.submissionService.update(id, updateSubmissionDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: DeleteResult })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.submissionService.remove(id);
  }
}
