import { CreateCategoryDto } from 'src/modules/problem/dto/category/create-category.dto';
import { ReturnCategoryDto } from 'src/modules/problem/dto/category/return-category.dto';
import { Category } from 'src/modules/problem/entities/category.entity';
import { CategoryEnum } from 'src/modules/problem/enum/category.enum';

export class CategoryFactory {
  static makeCategoryRepositoryMock() {
    return {
      createAndSave: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByProblemId: jest.fn(),
      updateById: jest.fn(),
      delete: jest.fn(),
      deleteByProblemId: jest.fn(),
    };
  }

  static makeCreateCategoryDto() {
    return new CreateCategoryDto(CategoryEnum.BASIC_MATH);
  }

  static makeCategoryEntity() {
    return new Category(1, 1, CategoryEnum.BASIC_MATH);
  }

  static makeReturnCategoryDto() {
    return new ReturnCategoryDto(1, 1, CategoryEnum.BASIC_MATH);
  }
}
