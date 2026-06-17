import { ProblemResponse } from 'src/modules/problem/use-case/problem/response/problem.response';
import { FindAllProblemUseCase } from 'src/modules/problem/use-case/problem/find-all.use-case';
import { CategoryFactory } from 'test/factories/category.factory';
import { ProblemFactory } from 'test/factories/problem.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('FindAllProblemUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let useCase: FindAllProblemUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();

    useCase = new FindAllProblemUseCase(
      problemRepositoryMock as any,
      categoryRepositoryMock as any,
      testCaseRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a ProblemResponse for each problem with its categories and test cases', async () => {
    const savedProblem = ProblemFactory.makeProblemEntity();
    const savedCategory = CategoryFactory.makeCategoryEntity();
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();

    problemRepositoryMock.findAllOrdered.mockResolvedValue([savedProblem]);
    categoryRepositoryMock.findByProblemId.mockResolvedValue([savedCategory]);
    testCaseRepositoryMock.findByProblemId.mockResolvedValue([savedTestCase]);

    const result = await useCase.execute();

    expect(problemRepositoryMock.findAllOrdered).toHaveBeenCalledTimes(1);
    expect(categoryRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      savedProblem.id,
    );
    expect(testCaseRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      savedProblem.id,
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ProblemResponse);
    expect(result[0].problem).toBe(savedProblem);
    expect(result[0].categories).toEqual([savedCategory]);
    expect(result[0].testCases).toEqual([savedTestCase]);
  });
});
