import { NotFoundException } from '@nestjs/common';
import { CreatePlaygroundSubmissionUseCase } from 'src/modules/submission/use-case/create-playground.use-case';
import { ProblemFactory } from 'test/factories/problem.factory';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';
import { TestRunnerFactory } from 'test/factories/test-runner.factory';

describe('CreatePlaygroundSubmissionUseCase', () => {
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let testRunnerServiceMock: ReturnType<
    typeof TestRunnerFactory.makeTestResultServiceMock
  >;
  let useCase: CreatePlaygroundSubmissionUseCase;

  beforeEach(() => {
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    useCase = new CreatePlaygroundSubmissionUseCase(
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
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

    problemRepositoryMock.findById.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );
    testCaseRepositoryMock.findByProblemId.mockResolvedValue(testCases);
    testRunnerServiceMock.runTests.mockResolvedValue(testResult);

    const result = await useCase.execute(createSubmissionDto);

    expect(problemRepositoryMock.findById).toHaveBeenCalledWith(
      createSubmissionDto.idProblem,
      undefined,
    );
    expect(testCaseRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      createSubmissionDto.idProblem,
      undefined,
    );
    expect(testRunnerServiceMock.runTests).toHaveBeenCalledWith(
      testCases,
      createSubmissionDto.text,
      createSubmissionDto.language,
    );
    expect(result).toBe(testResult);
  });

  it('should throw NotFoundException when problem is not found', async () => {
    problemRepositoryMock.findById.mockResolvedValue(null);

    const createPromise = useCase.execute(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('Problem not found');
  });

  it('should throw NotFoundException when there are no test cases', async () => {
    problemRepositoryMock.findById.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );
    testCaseRepositoryMock.findByProblemId.mockResolvedValue([]);

    const createPromise = useCase.execute(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow(
      'There are no test cases for this problem',
    );
  });
});
