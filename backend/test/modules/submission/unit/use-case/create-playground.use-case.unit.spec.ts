import { NotFoundException } from '@nestjs/common';
import { CreatePlaygroundSubmissionUseCase } from 'src/modules/submission/use-case/create-playground.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';
import { TestRunnerFactory } from 'test/factories/test-runner.factory';

describe('CreatePlaygroundSubmissionUseCase', () => {
  let problemServiceMock: {
    findProblemEntityById: jest.Mock;
  };
  let testCaseServiceMock: {
    findAllEntitiesByProblemId: jest.Mock;
  };
  let testRunnerServiceMock: ReturnType<
    typeof TestRunnerFactory.makeTestResultServiceMock
  >;
  let useCase: CreatePlaygroundSubmissionUseCase;

  beforeEach(() => {
    problemServiceMock = {
      findProblemEntityById: jest.fn(),
    };
    testCaseServiceMock = {
      findAllEntitiesByProblemId: jest.fn(),
    };
    testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    useCase = new CreatePlaygroundSubmissionUseCase(
      problemServiceMock as any,
      testCaseServiceMock as any,
      testRunnerServiceMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should run tests and return TestResult', async () => {
    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
    const testCases = [TestCaseFactory.makeTestCaseEntity()];
    const testResult = TestRunnerFactory.makeTestResult();

    problemServiceMock.findProblemEntityById.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );
    testCaseServiceMock.findAllEntitiesByProblemId.mockResolvedValue(testCases);
    testRunnerServiceMock.runTests.mockResolvedValue(testResult);

    const result = await useCase.execute(createSubmissionDto);

    expect(problemServiceMock.findProblemEntityById).toHaveBeenCalledWith(
      createSubmissionDto.idProblem,
    );
    expect(testCaseServiceMock.findAllEntitiesByProblemId).toHaveBeenCalledWith(
      createSubmissionDto.idProblem,
    );
    expect(testRunnerServiceMock.runTests).toHaveBeenCalledWith(
      testCases,
      createSubmissionDto.text,
      createSubmissionDto.language,
    );
    expect(result).toBe(testResult);
  });

  it('should throw NotFoundException when problem is not found', async () => {
    problemServiceMock.findProblemEntityById.mockRejectedValue(
      new NotFoundException('Problem not found'),
    );

    const createPromise = useCase.execute(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('Problem not found');
  });

  it('should throw NotFoundException when there are no test cases', async () => {
    problemServiceMock.findProblemEntityById.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );
    testCaseServiceMock.findAllEntitiesByProblemId.mockResolvedValue([]);

    const createPromise = useCase.execute(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow(
      'There are no test cases for this problem',
    );
  });
});
