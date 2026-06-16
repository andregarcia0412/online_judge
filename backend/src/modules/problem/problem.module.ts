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
import { CreateCategoryUseCase } from './use-case/category/create.use-case';
import { FindAllCategoriesByProblemIdUseCase } from './use-case/category/find-all-by-problem-id.use-case';
import { FindAllCategoriesUseCase } from './use-case/category/find-all.use-case';
import { FindCategoryByIdUseCase } from './use-case/category/find-by-id.use-case';
import { RemoveCategoryByProblemIdUseCase } from './use-case/category/remove-by-problem-id.use-case';
import { RemoveCategoryUseCase } from './use-case/category/remove.use-case';
import { UpdateCategoryUseCase } from './use-case/category/update.use-case';
import { CreateProblemUseCase } from './use-case/problem/create.use-case';
import { FindAllProblemUseCase } from './use-case/problem/find-all.use-case';
import { FindProblemByIdUseCase } from './use-case/problem/find-by-id.use-case';
import { FindProblemByTitleUseCase } from './use-case/problem/find-by-title.use-case';
import { FindAllTestCasesByProblemIdUseCase } from './use-case/problem/find-test-cases-by-id.use-case';
import { RemoveProblemUseCase } from './use-case/problem/remove.use-case';
import { UpdateProblemUseCase } from './use-case/problem/update.use-case';

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
    CreateCategoryUseCase,
    FindAllCategoriesUseCase,
    FindAllCategoriesByProblemIdUseCase,
    FindCategoryByIdUseCase,
    RemoveCategoryByProblemIdUseCase,
    RemoveCategoryUseCase,
    UpdateCategoryUseCase,
    CreateProblemUseCase,
    FindAllProblemUseCase,
    FindProblemByIdUseCase,
    FindProblemByTitleUseCase,
    FindAllTestCasesByProblemIdUseCase,
    RemoveProblemUseCase,
    UpdateProblemUseCase,
  ],
  exports: [
    ProblemService,
    ProblemRepositoryPort,
    CategoryRepositoryPort,
    TestCaseRepositoryPort,
  ],
})
export class ProblemModule {}
