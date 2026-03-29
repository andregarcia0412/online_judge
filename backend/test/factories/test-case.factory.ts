import { CreateTestCaseDto } from 'src/modules/test-case/dto/create-test-case.dto';
import { ReturnTestCaseDto } from 'src/modules/test-case/dto/return-test-case.dto';
import { TestCase } from 'src/modules/test-case/entities/test-case.entity';

export class TestCaseFactory {
  static makeTestCaseRepositoryMock() {
    return {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      findBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };
  }

  static makeCreateTestCaseDto() {
    return new CreateTestCaseDto(1, '10\n', '55\n');
  }

  static makeTestCaseEntity() {
    return new TestCase('123', 1, '10\n', '55\n');
  }

  static makeReturnTestCaseDto() {
    return ReturnTestCaseDto.fromEntity(this.makeTestCaseEntity());
  }
}
