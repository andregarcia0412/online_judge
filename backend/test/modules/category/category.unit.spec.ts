import { NotFoundException } from '@nestjs/common';
import { ReturnCategoryDto } from 'src/modules/problem/dto/category/return-category.dto';
import { CategoryEnum } from 'src/modules/problem/enum/category.enum';
import { CategoryService } from 'src/modules/problem/service/category.service';
import { CategoryFactory } from 'test/factories/category.factory';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('CategoryService', () => {
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let service: CategoryService;

  beforeEach(() => {
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    service = new CategoryService(
      categoryRepositoryMock as any,
      problemRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Create Category', () => {
    it('should create a category for a problem when problem id matches', async () => {
      const createCategoryDto = CategoryFactory.makeCreateCategoryDto();
      const savedProblem = ProblemFactory.makeProblemEntity();
      const createdCategory = CategoryFactory.makeCategoryEntity();
      const savedCategory = CategoryFactory.makeCategoryEntity();

      problemRepositoryMock.findOneBy.mockResolvedValue(savedProblem);
      categoryRepositoryMock.create.mockReturnValue(createdCategory);
      categoryRepositoryMock.save.mockResolvedValue(savedCategory);

      const result = await service.create(createCategoryDto, savedProblem.id);

      expect(problemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: savedProblem.id,
      });
      expect(categoryRepositoryMock.create).toHaveBeenCalledWith({
        id_problem: savedProblem.id,
        category: createCategoryDto.category,
      });
      expect(categoryRepositoryMock.save).toHaveBeenCalledWith(createdCategory);

      expect(result).toBeInstanceOf(ReturnCategoryDto);
      expect(result).toMatchObject(CategoryFactory.makeReturnCategoryDto());
    });

    it('should throw NotFoundException when problem id does not match', async () => {
      const createCategoryDto = CategoryFactory.makeCreateCategoryDto();

      const createPromise = service.create(createCategoryDto, 123);

      await expect(createPromise).rejects.toThrow(NotFoundException);
      await expect(createPromise).rejects.toThrow('Problem not found');
    });
  });

  describe('Find All Categories', () => {
    it('should return a list of categories', async () => {
      const savedCategory = CategoryFactory.makeCategoryEntity();

      categoryRepositoryMock.find.mockResolvedValue([savedCategory]);

      const result = await service.findAll();

      expect(categoryRepositoryMock.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnCategoryDto);
      expect(result[0]).toMatchObject({
        id: savedCategory.id,
        id_problem: savedCategory.id_problem,
        category: savedCategory.category,
      });
    });
  });

  describe('Find Category By Id', () => {
    it('should return ReturnCategoryDto when id matches', async () => {
      const savedCategory = CategoryFactory.makeCategoryEntity();

      categoryRepositoryMock.findOneBy.mockResolvedValue(savedCategory);

      const result = await service.findOneById(savedCategory.id);

      expect(categoryRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: savedCategory.id,
      });

      expect(result).toMatchObject({
        id: savedCategory.id,
        id_problem: savedCategory.id_problem,
        category: savedCategory.category,
      });
    });

    it('should throw NotFoundException when id does not match', async () => {
      const findPromise = service.findOneById(123);

      await expect(findPromise).rejects.toThrow(NotFoundException);
      await expect(findPromise).rejects.toThrow('Category not found');
    });
  });

  describe('Find Categories By Problem Id', () => {
    it('should return a list of ReturnCategoryDto when problem id matches', async () => {
      const savedProblem = ProblemFactory.makeProblemEntity();
      const savedCategory = CategoryFactory.makeCategoryEntity();

      problemRepositoryMock.findOneBy.mockResolvedValue(savedProblem);
      categoryRepositoryMock.findBy.mockResolvedValue([savedCategory]);

      const result = await service.findCategoriesByProblemId(savedCategory.id);

      expect(problemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: savedProblem.id,
      });
      expect(categoryRepositoryMock.findBy).toHaveBeenCalledWith({
        id_problem: savedProblem.id,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ReturnCategoryDto);
      expect(result[0]).toMatchObject({
        id: savedCategory.id,
        id_problem: savedCategory.id_problem,
        category: savedCategory.category,
      });
    });

    it('should throw NotFoundException when problem id does not match', async () => {
      const findPromise = service.findCategoriesByProblemId(123);

      await expect(findPromise).rejects.toThrow(NotFoundException);
      await expect(findPromise).rejects.toThrow('Problem not found');
    });
  });

  describe('Update Category', () => {
    it('should update a category and return update result', async () => {
      const categoryId = 1;
      const updateCategoryDto = {
        category: CategoryEnum.BFS,
      };

      const updateResult = {
        affected: 1,
        generatedMaps: [],
        raw: [],
      };

      categoryRepositoryMock.update.mockResolvedValue(updateResult);

      const result = await service.update(categoryId, updateCategoryDto);

      expect(categoryRepositoryMock.update).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
      expect(categoryRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updateResult);
    });
  });

  describe('Delete category', () => {
    it('should delete a category and return delete result', async () => {
      const categoryId = 1;
      const deleteResult = {
        affected: 1,
        raw: [],
      };

      categoryRepositoryMock.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(categoryId);

      expect(categoryRepositoryMock.delete).toHaveBeenCalledWith(categoryId);
      expect(categoryRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(deleteResult);
    });
  });
});
