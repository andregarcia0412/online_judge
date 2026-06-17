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

  it('should delegate to the repository and return the delete result', async () => {
    const problemId = 1;
    const deleteResult = { affected: 2, raw: [] };

    categoryRepositoryMock.deleteByProblemId.mockResolvedValue(deleteResult);

    const result = await useCase.execute(problemId);

    expect(categoryRepositoryMock.deleteByProblemId).toHaveBeenCalledWith(
      problemId,
    );
    expect(result).toEqual(deleteResult);
  });
});
