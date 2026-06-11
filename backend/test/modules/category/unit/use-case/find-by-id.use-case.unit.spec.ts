import { NotFoundException } from '@nestjs/common';
import { FindCategoryByIdUseCase } from 'src/modules/problem/use-case/category/find-by-id.use-case';
import { CategoryFactory } from 'test/factories/category.factory';

describe('FindCategoryByIdUseCase', () => {
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let useCase: FindCategoryByIdUseCase;

  beforeEach(() => {
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    useCase = new FindCategoryByIdUseCase(categoryRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the category when it exists', async () => {
    const savedCategory = CategoryFactory.makeCategoryEntity();
    categoryRepositoryMock.findById.mockResolvedValue(savedCategory);

    const result = await useCase.execute(savedCategory.id);

    expect(categoryRepositoryMock.findById).toHaveBeenCalledWith(
      savedCategory.id,
    );
    expect(result).toBe(savedCategory);
  });

  it('should throw NotFoundException when the category does not exist', async () => {
    categoryRepositoryMock.findById.mockResolvedValue(null);

    const findPromise = useCase.execute(123);

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('Category not found');
  });
});
