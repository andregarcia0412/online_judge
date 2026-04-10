import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Problem } from './entities/problem.entity';
import { TestCase } from './entities/test-case.entity';
import { CategoryRepositoryPort } from './interface/category.repository.port';
import { ProblemRepositoryPort } from './interface/problem.repository.port';
import { TestCaseRepositoryPort } from './interface/test-case.repository.port';
import { ProblemController } from './problem.controller';
import { CategoryRepository } from './repository/category.repository';
import { ProblemRepository } from './repository/problem.repository';
import { TestCaseRepository } from './repository/test-case.repository';
import { CategoryService } from './service/category.service';
import { ProblemService } from './service/problem.service';
import { TestCaseService } from './service/test-case.service';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, Category, TestCase])],
  controllers: [ProblemController],
  providers: [
    ProblemService,
    CategoryService,
    TestCaseService,
    { provide: ProblemRepositoryPort, useClass: ProblemRepository },
    { provide: CategoryRepositoryPort, useClass: CategoryRepository },
    { provide: TestCaseRepositoryPort, useClass: TestCaseRepository },
  ],
  exports: [
    ProblemService,
    ProblemRepositoryPort,
    CategoryRepositoryPort,
    TestCaseRepositoryPort,
  ],
})
export class ProblemModule {}
