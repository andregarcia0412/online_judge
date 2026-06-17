import { NotFoundException } from '@nestjs/common';
import { ProblemResponse } from 'src/modules/problem/use-case/problem/response/problem.response';
import { FindProblemByIdUseCase } from 'src/modules/problem/use-case/problem/find-by-id.use-case';
import { CategoryFactory } from 'test/factories/category.factory';
import { ProblemFactory } from 'test/factories/problem.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('FindProblemByIdUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let useCase: FindProblemByIdUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();

    useCase = new FindProblemByIdUseCase(
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

    problemRepositoryMock.findById.mockResolvedValue(savedProblem);
    categoryRepositoryMock.findByProblemId.mockResolvedValue([savedCategory]);
    testCaseRepositoryMock.findByProblemId.mockResolvedValue([savedTestCase]);

    const result = await useCase.execute(savedProblem.id);

    expect(problemRepositoryMock.findById).toHaveBeenCalledWith(savedProblem.id);
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
    problemRepositoryMock.findById.mockResolvedValue(null);

    const findPromise = useCase.execute(1);

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('Problem not found');
    expect(categoryRepositoryMock.findByProblemId).not.toHaveBeenCalled();
  });
});
