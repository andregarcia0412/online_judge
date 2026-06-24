import { NotFoundException } from '@nestjs/common';
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

  it('should update the problem and return it with its eager relations', async () => {
    const updatedProblem = ProblemFactory.makeProblemEntity();
    const updateProblemDto = {
      title: 'Fibonacci Updated',
      points: 10,
    };

    problemRepositoryMock.updateById.mockResolvedValue(updatedProblem);

    const result = await useCase.execute(
      updatedProblem.id,
      updateProblemDto as any,
    );

    expect(problemRepositoryMock.updateById).toHaveBeenCalledWith(
      updatedProblem.id,
      updateProblemDto,
    );
    expect(result).toBe(updatedProblem);
    expect(result.categories).toEqual(updatedProblem.categories);
    expect(result.testCases).toEqual(updatedProblem.testCases);
  });

  it('should throw NotFoundException when the problem does not exist', async () => {
    problemRepositoryMock.updateById.mockResolvedValue(null);

    const updatePromise = useCase.execute(123, { title: 'Updated' } as any);

    await expect(updatePromise).rejects.toThrow(NotFoundException);
    await expect(updatePromise).rejects.toThrow('Problem not found');
  });
});
