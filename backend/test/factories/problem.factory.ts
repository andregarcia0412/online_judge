import { CreateProblemDto } from 'src/modules/problem/dto/problem/create-problem.dto';
import { CreateCategoryDto } from 'src/modules/problem/dto/category/create-category.dto';
import { CreateTestCaseDto } from 'src/modules/problem/dto/test-case/create-test-case.dto';
import { ReturnProblemDto } from 'src/modules/problem/dto/problem/return-problem.dto';
import { Problem } from 'src/modules/problem/entities/problem.entity';
import { CategoryEnum } from 'src/modules/problem/enum/category.enum';
import { ProblemDifficultyEnum } from 'src/modules/problem/enum/problem-difficulty.enum';
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

  static makeProblemEntity(): Problem {
    const problem = new Problem();
    problem.id = 1;
    problem.title = 'Fibonacci';
    problem.points = 2;
    problem.author = 'user';
    problem.description = 'description';
    problem.inputDescription = 'input_description';
    problem.outputDescription = 'output_description';
    problem.inputExample = 'input_example';
    problem.outputExample = 'output_example';
    problem.totalSubmitted = 0;
    problem.totalAccepted = 0;
    problem.difficulty = ProblemDifficultyEnum.EASY;
    problem.createdAt = new Date(this.fixedData.getTime());
    problem.categories = [CategoryFactory.makeCategoryEntity()];
    problem.testCases = [TestCaseFactory.makeTestCaseEntity()];
    return problem;
  }

  static makeReturnProblemDto() {
    return ReturnProblemDto.fromEntity(this.makeProblemEntity());
  }
}
