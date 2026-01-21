import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateProblemDto })
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemService.create(createProblemDto);
  }

  @Get()
  @ApiCreatedResponse({ type: [CreateProblemDto] })
  findAll() {
    return this.problemService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: CreateProblemDto })
  findOne(@Param('id') id: string) {
    return this.problemService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProblemDto: UpdateProblemDto) {
    return this.problemService.update(+id, updateProblemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemService.remove(+id);
  }
}
