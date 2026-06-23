import { NotFoundException } from '@nestjs/common';
import { ProblemResponse } from 'src/modules/problem/use-case/problem/response/problem.response';
import { UpdateProblemUseCase } from 'src/modules/problem/use-case/problem/update.use-case';
import { CategoryFactory } from 'test/factories/category.factory';
import { ProblemFactory } from 'test/factories/problem.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('UpdateProblemUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let useCase: UpdateProblemUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();

    useCase = new UpdateProblemUseCase(
      problemRepositoryMock as any,
      categoryRepositoryMock as any,
      testCaseRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should update the problem and return a ProblemResponse with its relations', async () => {
    const updatedProblem = ProblemFactory.makeProblemEntity();
    const savedCategory = CategoryFactory.makeCategoryEntity();
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();
    const updateProblemDto = {
      title: 'Fibonacci Updated',
      points: 10,
    };

    problemRepositoryMock.updateById.mockResolvedValue(updatedProblem);
    categoryRepositoryMock.findByProblemId.mockResolvedValue([savedCategory]);
    testCaseRepositoryMock.findByProblemId.mockResolvedValue([savedTestCase]);

    const result = await useCase.execute(
      updatedProblem.id,
      updateProblemDto as any,
    );

    expect(problemRepositoryMock.updateById).toHaveBeenCalledWith(
      updatedProblem.id,
      updateProblemDto,
    );
    expect(categoryRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      updatedProblem.id,
    );
    expect(testCaseRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      updatedProblem.id,
    );
    expect(result).toBeInstanceOf(ProblemResponse);
    expect(result.problem).toBe(updatedProblem);
    expect(result.categories).toEqual([savedCategory]);
    expect(result.testCases).toEqual([savedTestCase]);
  });

  it('should throw NotFoundException when the problem does not exist', async () => {
    problemRepositoryMock.updateById.mockResolvedValue(null);

    const updatePromise = useCase.execute(123, { title: 'Updated' } as any);

    await expect(updatePromise).rejects.toThrow(NotFoundException);
    await expect(updatePromise).rejects.toThrow('Problem not found');
    expect(categoryRepositoryMock.findByProblemId).not.toHaveBeenCalled();
  });
});
