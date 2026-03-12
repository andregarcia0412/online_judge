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
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { ReturnTestCaseDto } from '../test-case/dto/return-test-case.dto';
import { CreateProblemDto } from './dto/create-problem.dto';
import { ReturnProblemDto } from './dto/return-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { ProblemService } from './problem.service';

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  @ApiCreatedResponse({ type: ReturnProblemDto })
  create(
    @Body() createProblemDto: CreateProblemDto,
  ): Promise<ReturnProblemDto> {
    return this.problemService.create(createProblemDto);
  }

  @Get()
  @ApiCreatedResponse({ type: [ReturnProblemDto] })
  findAll(): Promise<ReturnProblemDto[]> {
    return this.problemService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ReturnProblemDto })
  findOne(@Param('id') id: string): Promise<ReturnProblemDto> {
    return this.problemService.findOneById(+id);
  }

  @Get(':id/test-case')
  @ApiCreatedResponse({ type: [ReturnTestCaseDto] })
  async findAllTestCaseById(
    @Param('id') id: string,
  ): Promise<ReturnTestCaseDto[]> {
    return this.problemService.findAllTestCasesById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProblemDto: UpdateProblemDto,
  ): Promise<UpdateResult> {
    return this.problemService.update(+id, updateProblemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.problemService.remove(+id);
  }
}
