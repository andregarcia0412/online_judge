import { CreateCategoryDto } from 'src/modules/problem/dto/category/create-category.dto';
import { ReturnCategoryDto } from 'src/modules/problem/dto/category/return-category.dto';
import { Category } from 'src/modules/problem/entities/category.entity';
import { CategoryEnum } from 'src/modules/problem/enum/category.enum';

export class CategoryFactory {
  static makeCategoryRepositoryMock() {
    return {
      createAndSave: jest.fn(),
      createAndSaveMany: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByProblemId: jest.fn(),
      updateById: jest.fn(),
      delete: jest.fn(),
      deleteByProblemId: jest.fn(),
    };
  }

  static makeCategoryUseCaseMocks() {
    const createCategoryUseCase = { execute: jest.fn() };
    const findAllCategoriesUseCase = { execute: jest.fn() };
    const findCategoryByIdUseCase = { execute: jest.fn() };
    const findAllCategoriesByProblemIdUseCase = { execute: jest.fn() };
    const updateCategoryUseCase = { execute: jest.fn() };
    const removeCategoryUseCase = { execute: jest.fn() };

    return {
      createCategoryUseCase,
      findAllCategoriesUseCase,
      findCategoryByIdUseCase,
      findAllCategoriesByProblemIdUseCase,
      updateCategoryUseCase,
      removeCategoryUseCase,
    };
  }

  static makeCreateCategoryDto() {
    return new CreateCategoryDto(CategoryEnum.MATH);
  }

  static makeCategoryEntity(): Category {
    const category = new Category();
    category.id = 1;
    category.idProblem = 1;
    category.category = CategoryEnum.MATH;
    return category;
  }

  static makeReturnCategoryDto() {
    return new ReturnCategoryDto(1, 1, CategoryEnum.MATH);
  }
}
