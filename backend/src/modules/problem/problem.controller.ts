import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm';
import { ReturnTestCaseDto } from './dto/test-case/return-test-case.dto';
import { CreateProblemDto } from './dto/problem/create-problem.dto';
import { ReturnProblemDto } from './dto/problem/return-problem.dto';
import { UpdateProblemDto } from './dto/problem/update-problem.dto';
import { ProblemService } from './service/problem.service';
import { ReturnCategoryDto } from './dto/category/return-category.dto';
import { CreateCategoryDto } from './dto/category/create-category.dto';
import { CategoryService } from './service/category.service';
import { UpdateCategoryDto } from './dto/category/update-category.dto';
import { CreateTestCaseDto } from './dto/test-case/create-test-case.dto';
import { TestCaseService } from './service/test-case.service';
import { UpdateTestCaseDto } from './dto/test-case/update-test-case.dto';
import { ReturnCategoriesDto } from './dto/category/return-categories.dto';

@Controller()
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
    private readonly categoryService: CategoryService,
    private readonly testCaseService: TestCaseService,
  ) {}

  @Post('/problem')
  @ApiCreatedResponse({ type: ReturnProblemDto })
  create(
    @Body() createProblemDto: CreateProblemDto,
  ): Promise<ReturnProblemDto> {
    return this.problemService.create(createProblemDto);
  }

  @Get('/problem')
  @ApiOkResponse({ type: [ReturnProblemDto] })
  findAll(): Promise<ReturnProblemDto[]> {
    return this.problemService.findAll();
  }

  @Get('/problem/:id')
  @ApiOkResponse({ type: ReturnProblemDto })
  findOne(@Param('id') id: string): Promise<ReturnProblemDto> {
    return this.problemService.findOneById(+id);
  }

  @Get('/problem/:id/test-case')
  @ApiOkResponse({ type: [ReturnTestCaseDto] })
  async findAllTestCaseById(
    @Param('id') id: string,
  ): Promise<ReturnTestCaseDto[]> {
    return this.testCaseService.findAllByProblemId(+id);
  }

  @Patch('/problem/:id')
  @ApiOkResponse({ type: UpdateResult })
  update(
    @Param('id') id: string,
    @Body() updateProblemDto: UpdateProblemDto,
  ): Promise<UpdateResult> {
    return this.problemService.update(+id, updateProblemDto);
  }

  @Delete('/problem/:id')
  @ApiOkResponse({ type: DeleteResult })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.problemService.remove(+id);
  }

  @Post('/problem/:id/category')
  @ApiCreatedResponse({ type: ReturnCategoryDto })
  async createCategory(
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ReturnCategoryDto> {
    return await this.categoryService.create(createCategoryDto, +id);
  }

  @Get('/problem/:id/category')
  @ApiOkResponse({ type: [ReturnCategoryDto] })
  async findCategoriesByProblemId(
    @Param('id') id: string,
  ): Promise<ReturnCategoryDto[]> {
    return this.categoryService.findCategoriesByProblemId(+id);
  }

  @Get('/category')
  @ApiOkResponse({ type: [ReturnCategoriesDto] })
  getAllAvailableCategories(): ReturnCategoriesDto[] {
    return this.categoryService.getAvailableCategories();
  }

  @Get('/category/:id')
  @ApiOkResponse({ type: ReturnCategoryDto })
  async findCategoryById(@Param('id') id: string): Promise<ReturnCategoryDto> {
    return await this.categoryService.findOneById(+id);
  }

  @Patch('/category/:id')
  @ApiOkResponse({ type: UpdateResult })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete('/category/:id')
  @ApiOkResponse({ type: DeleteResult })
  async removeCategory(@Param('id') id: string): Promise<DeleteResult> {
    return await this.categoryService.remove(+id);
  }

  @Post('/test-case')
  @ApiCreatedResponse({ type: ReturnTestCaseDto })
  createTestCase(
    @Body() createTestCaseDto: CreateTestCaseDto,
  ): Promise<ReturnTestCaseDto> {
    return this.testCaseService.create(createTestCaseDto);
  }

  @Get('/test-case')
  @ApiOkResponse({ type: [ReturnTestCaseDto] })
  findAllTestCases(): Promise<ReturnTestCaseDto[]> {
    return this.testCaseService.findAll();
  }

  @Get('/test-case/:id')
  @ApiOkResponse({ type: ReturnTestCaseDto })
  findOneTestCase(@Param('id') id: string): Promise<ReturnTestCaseDto> {
    return this.testCaseService.findOneById(id);
  }

  @Patch('/test-case/:id')
  @ApiOkResponse({ type: UpdateResult })
  updateTestCase(
    @Param('id') id: string,
    @Body() updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<UpdateResult> {
    return this.testCaseService.update(id, updateTestCaseDto);
  }

  @Delete('/test-case/:id')
  @ApiOkResponse({ type: DeleteResult })
  removeTestCase(@Param('id') id: string): Promise<DeleteResult> {
    return this.testCaseService.remove(id);
  }
}
