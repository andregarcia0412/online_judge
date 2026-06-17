import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTestCaseUseCase } from 'src/modules/problem/use-case/test-case/create.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';

describe('CreateTestCaseUseCase', () => {
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let useCase: CreateTestCaseUseCase;

  beforeEach(() => {
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();

    useCase = new CreateTestCaseUseCase(
      testCaseRepositoryMock as any,
      problemRepositoryMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a test case when the problem exists', async () => {
    const createTestCaseDto = TestCaseFactory.makeCreateTestCaseDto();
    const savedProblem = ProblemFactory.makeProblemEntity();
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();

    problemRepositoryMock.findById.mockResolvedValue(savedProblem);
    testCaseRepositoryMock.createAndSave.mockResolvedValue(savedTestCase);

    const result = await useCase.execute(createTestCaseDto);

    expect(problemRepositoryMock.findById).toHaveBeenCalledWith(
      createTestCaseDto.id_problem,
    );
    expect(problemRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(testCaseRepositoryMock.createAndSave).toHaveBeenCalledWith(
      createTestCaseDto,
    );
    expect(result).toBe(savedTestCase);
  });

  it('should throw BadRequestException when id_problem is missing', async () => {
    const createTestCaseDto = {
      ...TestCaseFactory.makeCreateTestCaseDto(),
      id_problem: undefined as unknown as number,
    };

    const createPromise = useCase.execute(createTestCaseDto);

    await expect(createPromise).rejects.toThrow(BadRequestException);
    await expect(createPromise).rejects.toThrow('Problem Id is missing');

    expect(problemRepositoryMock.findById).not.toHaveBeenCalled();
    expect(testCaseRepositoryMock.createAndSave).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when the problem does not exist', async () => {
    const createTestCaseDto = TestCaseFactory.makeCreateTestCaseDto();

    problemRepositoryMock.findById.mockResolvedValue(null);

    const createPromise = useCase.execute(createTestCaseDto);

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('Problem not found');

    expect(problemRepositoryMock.findById).toHaveBeenCalledWith(
      createTestCaseDto.id_problem,
    );
    expect(problemRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(testCaseRepositoryMock.createAndSave).not.toHaveBeenCalled();
  });
});
