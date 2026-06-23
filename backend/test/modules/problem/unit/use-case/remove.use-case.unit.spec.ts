import { RemoveProblemUseCase } from 'src/modules/problem/use-case/problem/remove.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('RemoveProblemUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let useCase: RemoveProblemUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    useCase = new RemoveProblemUseCase(problemRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to the repository and resolve void', async () => {
    const problemId = 1;

    problemRepositoryMock.delete.mockResolvedValue(undefined);

    const result = await useCase.execute(problemId);

    expect(problemRepositoryMock.delete).toHaveBeenCalledWith(problemId);
    expect(result).toBeUndefined();
  });
});
