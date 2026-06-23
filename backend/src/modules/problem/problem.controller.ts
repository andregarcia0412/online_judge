import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/category/create-category.dto';
import { ReturnCategoriesDto } from './dto/category/return-categories.dto';
import { ReturnCategoryDto } from './dto/category/return-category.dto';
import { UpdateCategoryDto } from './dto/category/update-category.dto';
import { CreateProblemDto } from './dto/problem/create-problem.dto';
import { ReturnProblemDto } from './dto/problem/return-problem.dto';
import { UpdateProblemDto } from './dto/problem/update-problem.dto';
import { CreateTestCaseDto } from './dto/test-case/create-test-case.dto';
import { ReturnTestCaseDto } from './dto/test-case/return-test-case.dto';
import { UpdateTestCaseDto } from './dto/test-case/update-test-case.dto';
import { CategoryServicePort } from './interface/service/category.service.port';
import { ProblemServicePort } from './interface/service/problem.service.port';
import { TestCaseServicePort } from './interface/service/test-case.service.port';

@Controller()
export class ProblemController {
  constructor(
    @Inject(ProblemServicePort)
    private readonly problemService: ProblemServicePort,
    @Inject(CategoryServicePort)
    private readonly categoryService: CategoryServicePort,
    @Inject(TestCaseServicePort)
    private readonly testCaseService: TestCaseServicePort,
  ) {}

  @Post('/problem')
  @ApiCreatedResponse({ type: ReturnProblemDto })
  async create(
    @Body() createProblemDto: CreateProblemDto,
  ): Promise<ReturnProblemDto> {
    return await this.problemService.create(createProblemDto);
  }

  @Get('/problem')
  @ApiOkResponse({ type: [ReturnProblemDto] })
  async findAll(): Promise<ReturnProblemDto[]> {
    return await this.problemService.findAll();
  }

  @Get('/problem/:id')
  @ApiOkResponse({ type: ReturnProblemDto })
  async findOne(@Param('id') id: string): Promise<ReturnProblemDto> {
    return await this.problemService.findOneById(+id);
  }

  @Get('/problem/:id/test-case')
  @ApiOkResponse({ type: [ReturnTestCaseDto] })
  async findAllTestCaseById(
    @Param('id') id: string,
  ): Promise<ReturnTestCaseDto[]> {
    return await this.testCaseService.findAllByProblemId(+id);
  }

  @Patch('/problem/:id')
  @ApiOkResponse({ type: ReturnProblemDto })
  async update(
    @Param('id') id: string,
    @Body() updateProblemDto: UpdateProblemDto,
  ): Promise<ReturnProblemDto> {
    return await this.problemService.update(+id, updateProblemDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/problem/:id')
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.problemService.remove(+id);
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
  @ApiOkResponse({ type: ReturnCategoryDto })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ReturnCategoryDto> {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/category/:id')
  @ApiNoContentResponse()
  async removeCategory(@Param('id') id: string): Promise<void> {
    await this.categoryService.remove(+id);
  }

  @Post('/test-case')
  @ApiCreatedResponse({ type: ReturnTestCaseDto })
  async createTestCase(
    @Body() createTestCaseDto: CreateTestCaseDto,
  ): Promise<ReturnTestCaseDto> {
    return await this.testCaseService.create(createTestCaseDto);
  }

  @Get('/test-case')
  @ApiOkResponse({ type: [ReturnTestCaseDto] })
  async findAllTestCases(): Promise<ReturnTestCaseDto[]> {
    return await this.testCaseService.findAll();
  }

  @Get('/test-case/:id')
  @ApiOkResponse({ type: ReturnTestCaseDto })
  async findOneTestCase(@Param('id') id: string): Promise<ReturnTestCaseDto> {
    return await this.testCaseService.findOneById(id);
  }

  @Patch('/test-case/:id')
  @ApiOkResponse({ type: ReturnTestCaseDto })
  async updateTestCase(
    @Param('id') id: string,
    @Body() updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<ReturnTestCaseDto> {
    return await this.testCaseService.update(id, updateTestCaseDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/test-case/:id')
  @ApiNoContentResponse()
  async removeTestCase(@Param('id') id: string): Promise<void> {
    await this.testCaseService.remove(id);
  }
}
