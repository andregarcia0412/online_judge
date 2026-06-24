import { FindAllProblemUseCase } from 'src/modules/problem/use-case/problem/find-all.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('FindAllProblemUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let useCase: FindAllProblemUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    useCase = new FindAllProblemUseCase(problemRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return each problem with its eager relations', async () => {
    const savedProblem = ProblemFactory.makeProblemEntity();

    problemRepositoryMock.findAllOrdered.mockResolvedValue([savedProblem]);

    const result = await useCase.execute();

    expect(problemRepositoryMock.findAllOrdered).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(savedProblem);
    expect(result[0].categories).toEqual(savedProblem.categories);
    expect(result[0].testCases).toEqual(savedProblem.testCases);
  });
});
