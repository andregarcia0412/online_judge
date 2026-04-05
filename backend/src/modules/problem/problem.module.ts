import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from '../test-case/entities/test-case.entity';
import { Problem } from './entities/problem.entity';
import { ProblemController } from './problem.controller';
import { ProblemService } from './service/problem.service';
import { Category } from './entities/category.entity';
import { CategoryService } from './service/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, TestCase, Category])],
  controllers: [ProblemController],
  providers: [ProblemService, CategoryService],
  exports: [ProblemService],
})
export class ProblemModule {}
