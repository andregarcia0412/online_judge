import { RemoveCategoryByProblemIdUseCase } from 'src/modules/problem/use-case/category/remove-by-problem-id.use-case';
import { CategoryFactory } from 'test/factories/category.factory';

describe('RemoveCategoryByProblemIdUseCase', () => {
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let useCase: RemoveCategoryByProblemIdUseCase;

  beforeEach(() => {
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    useCase = new RemoveCategoryByProblemIdUseCase(
      categoryRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to the repository and resolve void', async () => {
    const problemId = 1;

    categoryRepositoryMock.deleteByProblemId.mockResolvedValue(undefined);

    const result = await useCase.execute(problemId);

    expect(categoryRepositoryMock.deleteByProblemId).toHaveBeenCalledWith(
      problemId,
    );
    expect(result).toBeUndefined();
  });
});
