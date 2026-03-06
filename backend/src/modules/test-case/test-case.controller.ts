import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestCaseService } from './test-case.service';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ReturnTestCaseDto } from './dto/return-test-case.dto';
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';

@Controller('test-case')
export class TestCaseController {
  constructor(private readonly testCaseService: TestCaseService) {}

  @Post()
  @ApiCreatedResponse({ type: ReturnTestCaseDto })
  create(
    @Body() createTestCaseDto: CreateTestCaseDto,
  ): Promise<ReturnTestCaseDto> {
    return this.testCaseService.create(createTestCaseDto);
  }

  @Get()
  @ApiCreatedResponse({ type: [ReturnTestCaseDto] })
  findAll(): Promise<ReturnTestCaseDto[]> {
    return this.testCaseService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: ReturnTestCaseDto })
  findOne(@Param('id') id: string): Promise<ReturnTestCaseDto> {
    return this.testCaseService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<UpdateResult> {
    return this.testCaseService.update(id, updateTestCaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.testCaseService.remove(id);
  }
}
