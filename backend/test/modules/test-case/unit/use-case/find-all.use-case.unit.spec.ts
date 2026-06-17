import { FindAllTestCasesUseCase } from 'src/modules/problem/use-case/test-case/find-all.use-case';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('FindAllTestCasesUseCase', () => {
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let useCase: FindAllTestCasesUseCase;

  beforeEach(() => {
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    useCase = new FindAllTestCasesUseCase(testCaseRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to the repository and return all test cases', async () => {
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();

    testCaseRepositoryMock.findAll.mockResolvedValue([savedTestCase]);

    const result = await useCase.execute();

    expect(testCaseRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([savedTestCase]);
  });
});
