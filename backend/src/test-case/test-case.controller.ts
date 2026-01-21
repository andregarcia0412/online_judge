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

@Controller('test-case')
export class TestCaseController {
  constructor(private readonly testCaseService: TestCaseService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateTestCaseDto })
  create(@Body() createTestCaseDto: CreateTestCaseDto) {
    return this.testCaseService.create(createTestCaseDto);
  }

  @Get()
  @ApiCreatedResponse({ type: [CreateTestCaseDto] })
  findAll() {
    return this.testCaseService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: CreateTestCaseDto })
  findOne(@Param('id') id: string) {
    return this.testCaseService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestCaseDto: UpdateTestCaseDto,
  ) {
    return this.testCaseService.update(id, updateTestCaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testCaseService.remove(id);
  }
}
