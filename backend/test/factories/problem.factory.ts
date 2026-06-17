import { CreateProblemDto } from 'src/modules/problem/dto/problem/create-problem.dto';
import { CreateCategoryDto } from 'src/modules/problem/dto/category/create-category.dto';
import { CreateTestCaseDto } from 'src/modules/problem/dto/test-case/create-test-case.dto';
import { ReturnProblemDto } from 'src/modules/problem/dto/problem/return-problem.dto';
import { Problem } from 'src/modules/problem/entities/problem.entity';
import { CategoryEnum } from 'src/modules/problem/enum/category.enum';
import { ProblemDifficultyEnum } from 'src/modules/problem/enum/problem-difficulty.enum';
import { ProblemResponse } from 'src/modules/problem/use-case/problem/response/problem.response';
import { CategoryFactory } from 'test/factories/category.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';

export class ProblemFactory {
  private static readonly fixedData = new Date('2026-01-01T00:00:00.000Z');

  static makeProblemRepositoryMock() {
    const findOneBy = jest.fn();
    const save = jest.fn();
    const find = jest.fn();
    const update = jest.fn();
    const deleteFn = jest.fn();

    return {
      findByTitle: jest.fn(),
      createAndSave: save,
      saveExistingEntity: jest.fn(),
      findAllOrdered: find,
      findById: findOneBy,
      updateById: update,
      delete: deleteFn,
    };
  }

  static makeProblemUseCaseMocks() {
    const createProblemUseCase = { execute: jest.fn() };
    const findAllProblemUseCase = { execute: jest.fn() };
    const findProblemByIdUseCase = { execute: jest.fn() };
    const findProblemByTitleUseCase = { execute: jest.fn() };
    const updateProblemUseCase = { execute: jest.fn() };
    const removeProblemUseCase = { execute: jest.fn() };

    return {
      createProblemUseCase,
      findAllProblemUseCase,
      findProblemByIdUseCase,
      findProblemByTitleUseCase,
      updateProblemUseCase,
      removeProblemUseCase,
    };
  }

  static makeProblemResponse() {
    return new ProblemResponse(
      this.makeProblemEntity(),
      [TestCaseFactory.makeTestCaseEntity()],
      [CategoryFactory.makeCategoryEntity()],
    );
  }

  static makeCreateProblemDto() {
    return new CreateProblemDto(
      'Fibonacci',
      2,
      'user',
      'description',
      'input_description',
      'output_description',
      'input_example',
      'output_example',
      ProblemDifficultyEnum.EASY,
      [new CreateCategoryDto(CategoryEnum.BASICS)],
      [new CreateTestCaseDto('10\n', '55\n')],
    );
  }

  static makeProblemEntity() {
    return new Problem(
      1,
      'Fibonacci',
      2,
      'user',
      'description',
      'input_description',
      'output_description',
      'input_example',
      'output_example',
      0,
      0,
      ProblemDifficultyEnum.EASY,
      new Date(this.fixedData.getTime()),
    );
  }

  static makeReturnProblemDto() {
    return ReturnProblemDto.fromEntity(this.makeProblemEntity());
  }
}
