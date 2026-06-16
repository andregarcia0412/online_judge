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

  it('should delegate to the repository and return the delete result', async () => {
    const problemId = 1;
    const deleteResult = { affected: 1, raw: [] };

    problemRepositoryMock.delete.mockResolvedValue(deleteResult);

    const result = await useCase.execute(problemId);

    expect(problemRepositoryMock.delete).toHaveBeenCalledWith(problemId);
    expect(result).toEqual(deleteResult);
  });
});
