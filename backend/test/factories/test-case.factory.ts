import { CreateTestCaseDto } from 'src/modules/problem/dto/test-case/create-test-case.dto';
import { ReturnTestCaseDto } from 'src/modules/problem/dto/test-case/return-test-case.dto';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';

export class TestCaseFactory {
  static makeTestCaseRepositoryMock() {
    const createAndSave = jest.fn();
    const createAndSaveMany = jest.fn();
    const findAll = jest.fn();
    const findOneById = jest.fn();
    const findByProblemId = jest.fn();
    const updateById = jest.fn();

    return {
      createAndSave,
      createAndSaveMany,
      findAll,
      findOneById,
      findByProblemId,
      updateById,
      delete: jest.fn(),
      deleteByProblemId: jest.fn(),
    };
  }

  static makeCreateTestCaseDto() {
    return new CreateTestCaseDto('10\n', '55\n', 1);
  }

  static makeTestCaseEntity() {
    return new TestCase('123', 1, '10\n', '55\n');
  }

  static makeReturnTestCaseDto() {
    return ReturnTestCaseDto.fromEntity(this.makeTestCaseEntity());
  }
}
