import { CreateProblemDto } from 'src/modules/problem/dto/create-problem.dto';
import { ReturnProblemDto } from 'src/modules/problem/dto/return-problem.dto';
import { Problem } from 'src/modules/problem/entities/problem.entity';

export class ProblemFactory {
  private static readonly fixedData = new Date('2026-01-01T00:00:00.000Z');

  static makeProblemRepositoryMock() {
    return {
      create: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
      new Date(this.fixedData.getTime()),
    );
  }

  static makeReturnProblemDto() {
    return ReturnProblemDto.fromEntity(this.makeProblemEntity());
  }
}
