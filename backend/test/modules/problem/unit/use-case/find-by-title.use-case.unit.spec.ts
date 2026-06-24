import { NotFoundException } from '@nestjs/common';
import { FindProblemByTitleUseCase } from 'src/modules/problem/use-case/problem/find-by-title.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';

describe('FindProblemByTitleUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let useCase: FindProblemByTitleUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    useCase = new FindProblemByTitleUseCase(problemRepositoryMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the problem with its eager relations when it exists', async () => {
    const savedProblem = ProblemFactory.makeProblemEntity();

    problemRepositoryMock.findByTitle.mockResolvedValue(savedProblem);

    const result = await useCase.execute(savedProblem.title);

    expect(problemRepositoryMock.findByTitle).toHaveBeenCalledWith(
      savedProblem.title,
    );
    expect(result).toBe(savedProblem);
    expect(result.categories).toEqual(savedProblem.categories);
    expect(result.testCases).toEqual(savedProblem.testCases);
  });

  it('should throw NotFoundException when the problem does not exist', async () => {
    problemRepositoryMock.findByTitle.mockResolvedValue(null);

    const findPromise = useCase.execute('title');

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('Problem not found');
  });
});
