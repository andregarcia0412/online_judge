import { NotFoundException } from '@nestjs/common';
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

  it('should delegate to the repository and return the updated category', async () => {
    const categoryId = 1;
    const updateCategoryDto = { category: CategoryEnum.GRAPH };
    const updatedCategory = CategoryFactory.makeCategoryEntity();

    categoryRepositoryMock.updateById.mockResolvedValue(updatedCategory);

    const result = await useCase.execute(categoryId, updateCategoryDto);

    expect(categoryRepositoryMock.updateById).toHaveBeenCalledWith(
      categoryId,
      updateCategoryDto,
    );
    expect(result).toEqual(updatedCategory);
  });

  it('should throw NotFoundException when the category does not exist', async () => {
    categoryRepositoryMock.updateById.mockResolvedValue(null);

    await expect(
      useCase.execute(123, { category: CategoryEnum.GRAPH }),
    ).rejects.toThrow(new NotFoundException('Category not found'));
  });
});
