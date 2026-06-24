import { NotFoundException } from '@nestjs/common';
import { CategoryLabels } from 'src/modules/problem/constants/category.labels';
import { ReturnCategoriesDto } from 'src/modules/problem/dto/category/return-categories.dto';
import { ReturnCategoryDto } from 'src/modules/problem/dto/category/return-category.dto';
import { CategoryEnum } from 'src/modules/problem/enum/category.enum';
import { CategoryService } from 'src/modules/problem/service/category.service';
import { CategoryFactory } from 'test/factories/category.factory';

describe('CategoryService', () => {
  let useCaseMocks: ReturnType<
    typeof CategoryFactory.makeCategoryUseCaseMocks
  >;
  let service: CategoryService;

  beforeEach(() => {
    useCaseMocks = CategoryFactory.makeCategoryUseCaseMocks();

    service = new CategoryService(
      useCaseMocks.createCategoryUseCase as any,
      useCaseMocks.findAllCategoriesUseCase as any,
      useCaseMocks.findCategoryByIdUseCase as any,
      useCaseMocks.findAllCategoriesByProblemIdUseCase as any,
      useCaseMocks.updateCategoryUseCase as any,
      useCaseMocks.removeCategoryUseCase as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Create Category', () => {
    it('should delegate to CreateCategoryUseCase and map to ReturnCategoryDto', async () => {
      const createCategoryDto = CategoryFactory.makeCreateCategoryDto();
      const savedCategory = CategoryFactory.makeCategoryEntity();

      useCaseMocks.createCategoryUseCase.execute.mockResolvedValue(
        savedCategory,
      );

      const result = await service.create(createCategoryDto, savedCategory.id);

      expect(useCaseMocks.createCategoryUseCase.execute).toHaveBeenCalledWith(
        createCategoryDto,
        savedCategory.id,
      );
      expect(result).toBeInstanceOf(ReturnCategoryDto);
      expect(result).toMatchObject(CategoryFactory.makeReturnCategoryDto());
    });

    it('should propagate errors from CreateCategoryUseCase', async () => {
      const createCategoryDto = CategoryFactory.makeCreateCategoryDto();
      const error = new NotFoundException('Problem not found');

      useCaseMocks.createCategoryUseCase.execute.mockRejectedValue(error);

      await expect(service.create(createCategoryDto, 123)).rejects.toThrow(
        error,
      );
    });
  });

  describe('Find All Categories', () => {
    it('should map entities to ReturnCategoryDto', async () => {
      const savedCategory = CategoryFactory.makeCategoryEntity();

      useCaseMocks.findAllCategoriesUseCase.execute.mockResolvedValue([
        savedCategory,
      ]);

      const result = await service.findAll();

      expect(
        useCaseMocks.findAllCategoriesUseCase.execute,
      ).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnCategoryDto);
      expect(result[0]).toMatchObject({
        id: savedCategory.id,
        idProblem: savedCategory.idProblem,
        category: savedCategory.category,
      });
    });
  });

  describe('Find Category By Id', () => {
    it('should delegate to FindCategoryByIdUseCase and map to ReturnCategoryDto', async () => {
      const savedCategory = CategoryFactory.makeCategoryEntity();

      useCaseMocks.findCategoryByIdUseCase.execute.mockResolvedValue(
        savedCategory,
      );

      const result = await service.findOneById(savedCategory.id);

      expect(useCaseMocks.findCategoryByIdUseCase.execute).toHaveBeenCalledWith(
        savedCategory.id,
      );
      expect(result).toBeInstanceOf(ReturnCategoryDto);
      expect(result).toMatchObject({
        id: savedCategory.id,
        idProblem: savedCategory.idProblem,
        category: savedCategory.category,
      });
    });

    it('should propagate errors from FindCategoryByIdUseCase', async () => {
      const error = new NotFoundException('Category not found');

      useCaseMocks.findCategoryByIdUseCase.execute.mockRejectedValue(error);

      await expect(service.findOneById(123)).rejects.toThrow(error);
    });
  });

  describe('Find Categories By Problem Id', () => {
    it('should delegate to FindAllCategoriesByProblemIdUseCase and map entities', async () => {
      const savedCategory = CategoryFactory.makeCategoryEntity();

      useCaseMocks.findAllCategoriesByProblemIdUseCase.execute.mockResolvedValue(
        [savedCategory],
      );

      const result = await service.findCategoriesByProblemId(
        savedCategory.idProblem,
      );

      expect(
        useCaseMocks.findAllCategoriesByProblemIdUseCase.execute,
      ).toHaveBeenCalledWith(savedCategory.idProblem);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnCategoryDto);
      expect(result[0]).toMatchObject({
        id: savedCategory.id,
        idProblem: savedCategory.idProblem,
        category: savedCategory.category,
      });
    });

    it('should propagate errors from FindAllCategoriesByProblemIdUseCase', async () => {
      const error = new NotFoundException('Problem not found');

      useCaseMocks.findAllCategoriesByProblemIdUseCase.execute.mockRejectedValue(
        error,
      );

      await expect(service.findCategoriesByProblemId(123)).rejects.toThrow(
        error,
      );
    });
  });

  describe('Update Category', () => {
    it('should delegate to UpdateCategoryUseCase and map to ReturnCategoryDto', async () => {
      const categoryId = 1;
      const updateCategoryDto = {
        category: CategoryEnum.GRAPH,
      };
      const updatedCategory = CategoryFactory.makeCategoryEntity();

      useCaseMocks.updateCategoryUseCase.execute.mockResolvedValue(
        updatedCategory,
      );

      const result = await service.update(categoryId, updateCategoryDto);

      expect(useCaseMocks.updateCategoryUseCase.execute).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
      expect(useCaseMocks.updateCategoryUseCase.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBeInstanceOf(ReturnCategoryDto);
      expect(result).toMatchObject({
        id: updatedCategory.id,
        idProblem: updatedCategory.idProblem,
        category: updatedCategory.category,
      });
    });
  });

  describe('Delete Category', () => {
    it('should delegate to RemoveCategoryUseCase and resolve void', async () => {
      const categoryId = 1;

      useCaseMocks.removeCategoryUseCase.execute.mockResolvedValue(undefined);

      const result = await service.remove(categoryId);

      expect(useCaseMocks.removeCategoryUseCase.execute).toHaveBeenCalledWith(
        categoryId,
      );
      expect(useCaseMocks.removeCategoryUseCase.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('Get All Available Categories', () => {
    it('should return a list of all the available categories', () => {
      const result = service.getAvailableCategories();

      const expected = (
        Object.entries(CategoryLabels) as [CategoryEnum, string][]
      ).map(([value, label]) => new ReturnCategoriesDto(value, label));

      expect(result).toHaveLength(expected.length);
      expect(result).toEqual(expected);
      expect(result.every((item) => item instanceof ReturnCategoriesDto)).toBe(
        true,
      );
    });
  });
});
