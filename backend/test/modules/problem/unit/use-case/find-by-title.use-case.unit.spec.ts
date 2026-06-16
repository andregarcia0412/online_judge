import { NotFoundException } from '@nestjs/common';
import { ProblemResponse } from 'src/modules/problem/use-case/problem/response/problem.response';
import { FindProblemByTitleUseCase } from 'src/modules/problem/use-case/problem/find-by-title.use-case';
import { CategoryFactory } from 'test/factories/category.factory';
import { ProblemFactory } from 'test/factories/problem.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('FindProblemByTitleUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let useCase: FindProblemByTitleUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();

    useCase = new FindProblemByTitleUseCase(
      problemRepositoryMock as any,
      categoryRepositoryMock as any,
      testCaseRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a ProblemResponse when the problem exists', async () => {
    const savedProblem = ProblemFactory.makeProblemEntity();
    const savedCategory = CategoryFactory.makeCategoryEntity();
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();

    problemRepositoryMock.findByTitle.mockResolvedValue(savedProblem);
    categoryRepositoryMock.findByProblemId.mockResolvedValue([savedCategory]);
    testCaseRepositoryMock.findByProblemId.mockResolvedValue([savedTestCase]);

    const result = await useCase.execute(savedProblem.title);

    expect(problemRepositoryMock.findByTitle).toHaveBeenCalledWith(
      savedProblem.title,
    );
    expect(categoryRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      savedProblem.id,
    );
    expect(testCaseRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      savedProblem.id,
    );
    expect(result).toBeInstanceOf(ProblemResponse);
    expect(result.problem).toBe(savedProblem);
    expect(result.categories).toEqual([savedCategory]);
    expect(result.testCases).toEqual([savedTestCase]);
  });

  it('should throw NotFoundException when the problem does not exist', async () => {
    problemRepositoryMock.findByTitle.mockResolvedValue(null);

    const findPromise = useCase.execute('title');

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('Problem not found');
    expect(categoryRepositoryMock.findByProblemId).not.toHaveBeenCalled();
  });
});
