import { ConflictException } from '@nestjs/common';
import { CreateProblemUseCase } from 'src/modules/problem/use-case/problem/create.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('CreateProblemUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let dataSourceMock: { transaction: jest.Mock };
  let useCase: CreateProblemUseCase;
  const manager = {};

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    dataSourceMock = {
      transaction: jest
        .fn()
        .mockImplementation(async (callback) => callback(manager)),
    };

    useCase = new CreateProblemUseCase(
      problemRepositoryMock as any,
      dataSourceMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a problem with its relations via cascade when title does not match', async () => {
    const createProblemDto = ProblemFactory.makeCreateProblemDto();
    const savedProblem = ProblemFactory.makeProblemEntity();

    problemRepositoryMock.findByTitle.mockResolvedValue(null);
    problemRepositoryMock.createAndSave.mockResolvedValue(savedProblem);

    const result = await useCase.execute(createProblemDto);

    expect(dataSourceMock.transaction).toHaveBeenCalledTimes(1);
    expect(problemRepositoryMock.findByTitle).toHaveBeenCalledWith(
      createProblemDto.title,
      manager,
    );
    // uma única escrita: o grafo é montado e o cascade persiste os filhos
    expect(problemRepositoryMock.createAndSave).toHaveBeenCalledWith(
      {
        ...createProblemDto,
        categories: createProblemDto.category,
        testCases: createProblemDto.testCases,
      },
      manager,
    );
    expect(result).toBe(savedProblem);
    expect(result.categories).toEqual(savedProblem.categories);
    expect(result.testCases).toEqual(savedProblem.testCases);
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
