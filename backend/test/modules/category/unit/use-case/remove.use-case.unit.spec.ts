import { RemoveCategoryUseCase } from 'src/modules/problem/use-case/category/remove.use-case';
import { CategoryFactory } from 'test/factories/category.factory';

describe('RemoveCategoryUseCase', () => {
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let useCase: RemoveCategoryUseCase;

  beforeEach(() => {
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    useCase = new RemoveCategoryUseCase(categoryRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to the repository and return the delete result', async () => {
    const categoryId = 1;
    const deleteResult = { affected: 1, raw: [] };

    categoryRepositoryMock.delete.mockResolvedValue(deleteResult);

    const result = await useCase.execute(categoryId);

    expect(categoryRepositoryMock.delete).toHaveBeenCalledWith(categoryId);
    expect(result).toEqual(deleteResult);
  });
});
