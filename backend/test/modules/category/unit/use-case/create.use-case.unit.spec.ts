import { NotFoundException } from '@nestjs/common';
import { CreateCategoryUseCase } from 'src/modules/problem/use-case/category/create.use-case';
import { CategoryFactory } from 'test/factories/category.factory';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('CreateCategoryUseCase', () => {
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let useCase: CreateCategoryUseCase;

  beforeEach(() => {
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    useCase = new CreateCategoryUseCase(
      categoryRepositoryMock as any,
      problemRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create and return a category when the problem exists', async () => {
    const createCategoryDto = CategoryFactory.makeCreateCategoryDto();
    const savedProblem = ProblemFactory.makeProblemEntity();
    const savedCategory = CategoryFactory.makeCategoryEntity();

    problemRepositoryMock.findById.mockResolvedValue(savedProblem);
    categoryRepositoryMock.createAndSave.mockResolvedValue(savedCategory);

    const result = await useCase.execute(createCategoryDto, savedProblem.id);

    expect(problemRepositoryMock.findById).toHaveBeenCalledWith(
      savedProblem.id,
    );
    expect(categoryRepositoryMock.createAndSave).toHaveBeenCalledWith(
      createCategoryDto,
      savedProblem.id,
    );
    expect(result).toBe(savedCategory);
  });

  it('should throw NotFoundException when the problem does not exist', async () => {
    const createCategoryDto = CategoryFactory.makeCreateCategoryDto();

    problemRepositoryMock.findById.mockResolvedValue(null);

    const createPromise = useCase.execute(createCategoryDto, 123);

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('Problem not found');
    expect(categoryRepositoryMock.createAndSave).not.toHaveBeenCalled();
  });
});
