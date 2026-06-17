import { RemoveTestCaseUseCase } from 'src/modules/problem/use-case/test-case/remove.use-case';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('RemoveTestCaseUseCase', () => {
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let useCase: RemoveTestCaseUseCase;

  beforeEach(() => {
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    useCase = new RemoveTestCaseUseCase(testCaseRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to the repository and return the delete result', async () => {
    const testCaseId = '123';
    const deleteResult = {
      affected: 1,
      raw: [],
    };

    testCaseRepositoryMock.delete.mockResolvedValue(deleteResult);

    const result = await useCase.execute(testCaseId);

    expect(testCaseRepositoryMock.delete).toHaveBeenCalledWith(testCaseId);
    expect(testCaseRepositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(result).toEqual(deleteResult);
  });
});
