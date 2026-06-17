import { FindAllCategoriesUseCase } from 'src/modules/problem/use-case/category/find-all.use-case';
import { CategoryFactory } from 'test/factories/category.factory';

describe('FindAllCategoriesUseCase', () => {
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let useCase: FindAllCategoriesUseCase;

  beforeEach(() => {
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    useCase = new FindAllCategoriesUseCase(categoryRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return all categories from the repository', async () => {
    const savedCategory = CategoryFactory.makeCategoryEntity();
    categoryRepositoryMock.findAll.mockResolvedValue([savedCategory]);

    const result = await useCase.execute();

    expect(categoryRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([savedCategory]);
  });
});
