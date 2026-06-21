import {
  Body,
  Controller,
  Delete,
  Get,
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
import { TestResult } from '../test-runner/dto/test-result.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReturnSubmissionDto } from './dto/return-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { SubmissionService } from './submission.service';
import { GetUser } from 'src/shared/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/common/jwt-auth.guard';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ReturnSubmissionDto })
  async create(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @GetUser('userId') userId: string,
  ): Promise<CreateSubmissionDto> {
    return await this.submissionService.create(userId, createSubmissionDto);
  }

  @Post('/playground')
  @ApiCreatedResponse({ type: TestResult })
  async createPlaygroundSubmission(
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<TestResult> {
    return await this.submissionService.createPlaygroundSubmission(
      createSubmissionDto,
    );
  }

  @Get()
  @ApiOkResponse({ type: [ReturnSubmissionDto] })
  async findAll(): Promise<ReturnSubmissionDto[]> {
    return await this.submissionService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ReturnSubmissionDto })
  async findOne(@Param('id') id: string): Promise<ReturnSubmissionDto> {
    return await this.submissionService.findOneById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ReturnSubmissionDto })
  async update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<ReturnSubmissionDto> {
    return await this.submissionService.update(id, updateSubmissionDto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    await this.submissionService.remove(id);
  }
}
