import { NotFoundException } from '@nestjs/common';
import { FindProblemByIdUseCase } from 'src/modules/problem/use-case/problem/find-by-id.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('FindProblemByIdUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let useCase: FindProblemByIdUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    useCase = new FindProblemByIdUseCase(problemRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the problem with its eager relations when it exists', async () => {
    const savedProblem = ProblemFactory.makeProblemEntity();

    problemRepositoryMock.findById.mockResolvedValue(savedProblem);

    const result = await useCase.execute(savedProblem.id);

    expect(problemRepositoryMock.findById).toHaveBeenCalledWith(savedProblem.id);
    expect(result).toBe(savedProblem);
    expect(result.categories).toEqual(savedProblem.categories);
    expect(result.testCases).toEqual(savedProblem.testCases);
  });

  it('should throw NotFoundException when the problem does not exist', async () => {
    problemRepositoryMock.findById.mockResolvedValue(null);

    const findPromise = useCase.execute(1);

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('Problem not found');
  });
});
