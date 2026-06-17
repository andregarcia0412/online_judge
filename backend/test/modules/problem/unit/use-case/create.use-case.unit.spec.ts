import { ConflictException } from '@nestjs/common';
import { ProblemResponse } from 'src/modules/problem/use-case/problem/response/problem.response';
import { CreateProblemUseCase } from 'src/modules/problem/use-case/problem/create.use-case';
import { CategoryFactory } from 'test/factories/category.factory';
import { ProblemFactory } from 'test/factories/problem.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('CreateProblemUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let categoryRepositoryMock: ReturnType<
    typeof CategoryFactory.makeCategoryRepositoryMock
  >;
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let dataSourceMock: { transaction: jest.Mock };
  let useCase: CreateProblemUseCase;
  const manager = {};

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    categoryRepositoryMock = CategoryFactory.makeCategoryRepositoryMock();
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    dataSourceMock = {
      transaction: jest
        .fn()
        .mockImplementation(async (callback) => callback(manager)),
    };

    useCase = new CreateProblemUseCase(
      problemRepositoryMock as any,
      categoryRepositoryMock as any,
      testCaseRepositoryMock as any,
      dataSourceMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a problem and return ProblemResponse when title does not match', async () => {
    const createProblemDto = ProblemFactory.makeCreateProblemDto();
    const savedProblem = ProblemFactory.makeProblemEntity();
    const savedCategory = CategoryFactory.makeCategoryEntity();
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();

    problemRepositoryMock.findByTitle.mockResolvedValue(null);
    problemRepositoryMock.createAndSave.mockResolvedValue(savedProblem);
    categoryRepositoryMock.createAndSaveMany.mockResolvedValue([savedCategory]);
    testCaseRepositoryMock.createAndSaveMany.mockResolvedValue([savedTestCase]);

    const result = await useCase.execute(createProblemDto);

    expect(dataSourceMock.transaction).toHaveBeenCalledTimes(1);
    expect(problemRepositoryMock.findByTitle).toHaveBeenCalledWith(
      createProblemDto.title,
      manager,
    );
    expect(problemRepositoryMock.createAndSave).toHaveBeenCalledWith(
      createProblemDto,
      manager,
    );
    expect(categoryRepositoryMock.createAndSaveMany).toHaveBeenCalledWith(
      createProblemDto.category,
      savedProblem.id,
      manager,
    );
    expect(testCaseRepositoryMock.createAndSaveMany).toHaveBeenCalledWith(
      createProblemDto.test_cases,
      manager,
    );
    expect(result).toBeInstanceOf(ProblemResponse);
    expect(result.problem).toBe(savedProblem);
    expect(result.categories).toEqual([savedCategory]);
    expect(result.testCases).toEqual([savedTestCase]);
  });

  it('should throw ConflictException when title matches', async () => {
    const createProblemDto = ProblemFactory.makeCreateProblemDto();
    problemRepositoryMock.findByTitle.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );

    const createPromise = useCase.execute(createProblemDto);

    await expect(createPromise).rejects.toThrow(ConflictException);
    await expect(createPromise).rejects.toThrow(
      'A problem with this title already exists',
    );
    expect(problemRepositoryMock.createAndSave).not.toHaveBeenCalled();
  });
});
