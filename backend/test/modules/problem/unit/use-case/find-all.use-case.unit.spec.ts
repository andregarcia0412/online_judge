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

  it('should return each problem with its eager relations and the total count', async () => {
    const savedProblem = ProblemFactory.makeProblemEntity();

    problemRepositoryMock.findAllOrdered.mockResolvedValue([[savedProblem], 1]);

    const [problems, count] = await useCase.execute(1, 10);

    expect(problemRepositoryMock.findAllOrdered).toHaveBeenCalledWith(1, 10);
    expect(problemRepositoryMock.findAllOrdered).toHaveBeenCalledTimes(1);
    expect(count).toBe(1);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toBe(savedProblem);
    expect(problems[0].categories).toEqual(savedProblem.categories);
    expect(problems[0].testCases).toEqual(savedProblem.testCases);
  });
});
