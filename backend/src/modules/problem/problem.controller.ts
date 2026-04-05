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
import { DeleteResult } from 'typeorm';
import { ReturnTestCaseDto } from '../test-case/dto/return-test-case.dto';
import { CreateProblemDto } from './dto/problem/create-problem.dto';
import { ReturnProblemDto } from './dto/problem/return-problem.dto';
import { UpdateProblemDto } from './dto/problem/update-problem.dto';
import { ProblemService } from './service/problem.service';
import { ReturnCategoryDto } from './dto/category/return-category.dto';
import { CreateCategoryDto } from './dto/category/create-category.dto';
import { CategoryService } from './service/category.service';
import { UpdateCategoryDto } from './dto/category/update-category.dto';

@Controller('problem')
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
    private readonly categoryService: CategoryService,
  ) {}

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

  @Post(':id/category')
  @ApiCreatedResponse({ type: ReturnCategoryDto })
  async createCategory(
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ReturnCategoryDto> {
    return await this.categoryService.create(createCategoryDto, +id);
  }

  @Get(':id/category')
  @ApiCreatedResponse({ type: [ReturnCategoryDto] })
  async findCategoriesByProblemId(
    @Param('id') id: string,
  ): Promise<ReturnCategoryDto[]> {
    return this.categoryService.findCategoriesByProblemId(+id);
  }

  @Get('/category')
  @ApiCreatedResponse({ type: [ReturnCategoryDto] })
  async findAllCategory(): Promise<ReturnCategoryDto[]> {
    return await this.categoryService.findAll();
  }

  @Get('/category/:id')
  @ApiCreatedResponse({ type: ReturnCategoryDto })
  async findCategoryById(@Param('id') id: string): Promise<ReturnCategoryDto> {
    return await this.categoryService.findOneById(+id);
  }

  @Patch('/category/:id')
  @ApiCreatedResponse({ type: UpdateResult })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete('/category/:id')
  @ApiCreatedResponse({ type: DeleteResult })
  async removeCategory(@Param('id') id: string): Promise<DeleteResult> {
    return await this.categoryService.remove(+id);
  }
}
