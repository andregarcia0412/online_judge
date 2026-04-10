import { CreateProblemDto } from 'src/modules/problem/dto/problem/create-problem.dto';
import { ReturnProblemDto } from 'src/modules/problem/dto/problem/return-problem.dto';
import { Problem } from 'src/modules/problem/entities/problem.entity';
import { ProblemDifficultyEnum } from 'src/modules/problem/enum/problem-difficulty.enum';

export class ProblemFactory {
  private static readonly fixedData = new Date('2026-01-01T00:00:00.000Z');

  static makeProblemRepositoryMock() {
    const findOneBy = jest.fn();
    const save = jest.fn();
    const find = jest.fn();
    const update = jest.fn();
    const deleteFn = jest.fn();

    return {
      // Ports/adapters methods
      findByTitle: jest.fn(),
      createAndSave: save,
      findAllOrdered: find,
      findById: findOneBy,
      updateById: update,
      deleteProblemAndChildren: deleteFn,
      // Legacy TypeORM-like methods still used in other services/tests
      create: jest.fn(),
      findOneBy,
      save,
      find,
      findBy: jest.fn(),
      update,
      delete: deleteFn,
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
