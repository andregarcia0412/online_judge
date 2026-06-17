import { UpdateCategoryUseCase } from 'src/modules/problem/use-case/category/update.use-case';
import { CategoryEnum } from 'src/modules/problem/enum/category.enum';
import { CategoryFactory } from 'test/factories/category.factory';

describe('UpdateCategoryUseCase', () => {
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let useCase: UpdateCategoryUseCase;

  beforeEach(() => {
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    useCase = new UpdateCategoryUseCase(categoryRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to the repository and return the update result', async () => {
    const categoryId = 1;
    const updateCategoryDto = { category: CategoryEnum.GRAPH };
    const updateResult = { affected: 1, generatedMaps: [], raw: [] };

    categoryRepositoryMock.updateById.mockResolvedValue(updateResult);

    const result = await useCase.execute(categoryId, updateCategoryDto);

    expect(categoryRepositoryMock.updateById).toHaveBeenCalledWith(
      categoryId,
      updateCategoryDto,
    );
    expect(result).toEqual(updateResult);
  });
});
