import { FindAllTestCasesByProblemIdUseCase } from 'src/modules/problem/use-case/problem/find-test-cases-by-id.use-case';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('FindAllTestCasesByProblemIdUseCase', () => {
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let useCase: FindAllTestCasesByProblemIdUseCase;

  beforeEach(() => {
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    useCase = new FindAllTestCasesByProblemIdUseCase(
      testCaseRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to the repository and return the test cases of the problem', async () => {
    const problemId = 1;
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();

    testCaseRepositoryMock.findByProblemId.mockResolvedValue([savedTestCase]);

    const result = await useCase.execute(problemId);

    expect(testCaseRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      problemId,
    );
    expect(result).toEqual([savedTestCase]);
  });
});
