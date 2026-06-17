import { NotFoundException } from '@nestjs/common';
import { FindAllCategoriesByProblemIdUseCase } from 'src/modules/problem/use-case/category/find-all-by-problem-id.use-case';
import { CategoryFactory } from 'test/factories/category.factory';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('FindAllCategoriesByProblemIdUseCase', () => {
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let useCase: FindAllCategoriesByProblemIdUseCase;

  beforeEach(() => {
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    useCase = new FindAllCategoriesByProblemIdUseCase(
      problemRepositoryMock as any,
      categoryRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the categories of the problem when it exists', async () => {
    const savedProblem = ProblemFactory.makeProblemEntity();
    const savedCategory = CategoryFactory.makeCategoryEntity();

    problemRepositoryMock.findById.mockResolvedValue(savedProblem);
    categoryRepositoryMock.findByProblemId.mockResolvedValue([savedCategory]);

    const result = await useCase.execute(savedProblem.id);

    expect(problemRepositoryMock.findById).toHaveBeenCalledWith(
      savedProblem.id,
    );
    expect(categoryRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      savedProblem.id,
    );
    expect(result).toEqual([savedCategory]);
  });

  it('should throw NotFoundException when the problem does not exist', async () => {
    problemRepositoryMock.findById.mockResolvedValue(null);

    const findPromise = useCase.execute(123);

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('Problem not found');
    expect(categoryRepositoryMock.findByProblemId).not.toHaveBeenCalled();
  });
});
