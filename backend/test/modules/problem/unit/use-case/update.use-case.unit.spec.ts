import { UpdateProblemUseCase } from 'src/modules/problem/use-case/problem/update.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('UpdateProblemUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let useCase: UpdateProblemUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    useCase = new UpdateProblemUseCase(problemRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to the repository and return the update result', async () => {
    const problemId = 1;
    const updateProblemDto = {
      title: 'Fibonacci Updated',
      points: 10,
    };
    const updateResult = { generatedMaps: [], raw: [], affected: 1 };

    problemRepositoryMock.updateById.mockResolvedValue(updateResult);

    const result = await useCase.execute(problemId, updateProblemDto as any);

    expect(problemRepositoryMock.updateById).toHaveBeenCalledWith(
      problemId,
      updateProblemDto,
    );
    expect(result).toEqual(updateResult);
  });
});
