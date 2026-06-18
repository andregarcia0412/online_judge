import { NotFoundException } from '@nestjs/common';
import { CreateSubmissionUseCase } from 'src/modules/submission/use-case/create.use-case';
import { StatusEnum } from 'src/modules/submission/enum/submission-status';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { ProblemFactory } from 'test/factories/problem.factory';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';
import { TestRunnerFactory } from 'test/factories/test-runner.factory';
import { UserFactory } from 'test/factories/user.factory';

describe('CreateSubmissionUseCase', () => {
  let submissionRepositoryMock: ReturnType<
    typeof SubmissionFactory.makeSubmissionRepositoryMock
  >;
  let userRepositoryMock: ReturnType<typeof UserFactory.makeUserRepositoryMock>;
  let problemRepositoryMock: ReturnType<
    typeof ProblemFactory.makeProblemRepositoryMock
  >;
  let testCaseRepositoryMock: ReturnType<
    typeof TestCaseFactory.makeTestCaseRepositoryMock
  >;
  let testRunnerServiceMock: ReturnType<
    typeof TestRunnerFactory.makeTestResultServiceMock
  >;
  let userServiceMock: {
    updateUserStreakOnSubmission: jest.Mock;
  };
  let dataSourceMock: {
    transaction: jest.Mock;
  };
  let useCase: CreateSubmissionUseCase;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();
    userServiceMock = {
      updateUserStreakOnSubmission: jest.fn(),
    };
    dataSourceMock = {
      transaction: jest.fn(),
    };
    dataSourceMock.transaction.mockImplementation(async (callback) =>
      callback({}),
    );

    useCase = new CreateSubmissionUseCase(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
      userServiceMock as any,
      dataSourceMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should run tests, update points, and return ReturnSubmissionDto', async () => {
    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
    const savedUser = UserFactory.makeUserEntity();
    const savedProblem = ProblemFactory.makeProblemEntity();
    savedUser.total_submissions = 3;
    savedUser.total_resolved = 0;
    savedProblem.total_submitted = 3;
    savedProblem.total_accepted = 1;
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();

    const savedSubmission = SubmissionFactory.makeSubmissionEntity();
    const testResult = TestRunnerFactory.makeTestResult();

    userRepositoryMock.findOneById.mockResolvedValue(savedUser);
    problemRepositoryMock.findById.mockResolvedValue(savedProblem);
    testCaseRepositoryMock.findByProblemId.mockResolvedValue([savedTestCase]);
    testRunnerServiceMock.runTests.mockResolvedValue(testResult);
    submissionRepositoryMock.findOneUserAcceptedSubmission.mockResolvedValue(
      null,
    );
    submissionRepositoryMock.save.mockResolvedValue(savedSubmission);
    userRepositoryMock.save.mockResolvedValue(savedUser);
    problemRepositoryMock.saveExistingEntity.mockResolvedValue(savedProblem);

    const result = await useCase.execute(createSubmissionDto);

    expect(dataSourceMock.transaction).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.findOneById).toHaveBeenCalledWith(
      createSubmissionDto.id_user,
      expect.any(Object),
    );
    expect(problemRepositoryMock.findById).toHaveBeenCalledWith(
      createSubmissionDto.id_problem,
      expect.any(Object),
    );
    expect(testCaseRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      createSubmissionDto.id_problem,
      expect.any(Object),
    );
    expect(testRunnerServiceMock.runTests).toHaveBeenCalledWith(
      [savedTestCase],
      createSubmissionDto.text,
      createSubmissionDto.language,
    );
    expect(userServiceMock.updateUserStreakOnSubmission).toHaveBeenCalledWith(
      savedUser,
      expect.any(Object),
    );

    expect(
      submissionRepositoryMock.findOneUserAcceptedSubmission,
    ).toHaveBeenCalledWith(
      savedUser.id,
      createSubmissionDto.language,
      createSubmissionDto.id_problem,
      expect.any(Object),
    );
    expect(submissionRepositoryMock.save).toHaveBeenCalledWith(
      createSubmissionDto,
      testResult,
      expect.any(Object),
    );
    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        points: Number(savedProblem.points),
        total_submissions: 4,
        total_resolved: 1,
      }),
      expect.any(Object),
    );
    expect(problemRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        total_submitted: 4,
        total_accepted: 2,
      }),
      expect.any(Object),
    );

    expect(result).toMatchObject({
      id: savedSubmission.id,
      id_user: savedSubmission.id_user,
      id_problem: savedSubmission.id_problem,
      text: savedSubmission.text,
      language: savedSubmission.language,
      status: savedSubmission.status,
      execution_time: savedSubmission.execution_time,
      error: savedSubmission.error,
      memory_usage_MB: savedSubmission.memory_usage_MB,
      test_cases_passed: savedSubmission.test_cases_passed,
      last_stdout: testResult.stdout,
    });
  });

  it('should throw NotFoundException when user id does not match', async () => {
    userRepositoryMock.findOneById.mockResolvedValue(null);

    const createPromise = useCase.execute(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('User not found');

    expect(userServiceMock.updateUserStreakOnSubmission).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when problem id does not match', async () => {
    userRepositoryMock.findOneById.mockResolvedValue(
      UserFactory.makeUserEntity(),
    );
    problemRepositoryMock.findById.mockResolvedValue(null);

    const createPromise = useCase.execute(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('Problem not found');
  });

  it('should throw NotFoundException when there are no test cases', async () => {
    userRepositoryMock.findOneById.mockResolvedValue(
      UserFactory.makeUserEntity(),
    );
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

  it('should not add points when user already has accepted submission', async () => {
    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
    const savedUser = UserFactory.makeUserEntity();
    const savedProblem = ProblemFactory.makeProblemEntity();
    savedUser.total_submissions = 5;
    savedUser.total_resolved = 3;
    savedProblem.total_submitted = 8;
    savedProblem.total_accepted = 5;
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();
    const savedSubmission = SubmissionFactory.makeSubmissionEntity();
    const existingAcceptedSubmission = SubmissionFactory.makeSubmissionEntity();
    const testResult = TestRunnerFactory.makeTestResult();
    const initialPoints = Number(savedUser.points);

    userRepositoryMock.findOneById.mockResolvedValue(savedUser);
    problemRepositoryMock.findById.mockResolvedValue(savedProblem);
    testCaseRepositoryMock.findByProblemId.mockResolvedValue([savedTestCase]);
    testRunnerServiceMock.runTests.mockResolvedValue(testResult);
    submissionRepositoryMock.findOneUserAcceptedSubmission.mockResolvedValue(
      existingAcceptedSubmission,
    );
    submissionRepositoryMock.save.mockResolvedValue(savedSubmission);
    userRepositoryMock.save.mockResolvedValue(savedUser);
    problemRepositoryMock.saveExistingEntity.mockResolvedValue(savedProblem);

    await useCase.execute(createSubmissionDto);

    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        points: initialPoints,
        total_submissions: 6,
        total_resolved: 3,
      }),
      expect.any(Object),
    );
    expect(problemRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        total_submitted: 9,
        total_accepted: 5,
      }),
      expect.any(Object),
    );
  });

  it('should not add points when submission result is not accepted', async () => {
    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
    const savedUser = UserFactory.makeUserEntity();
    const savedProblem = ProblemFactory.makeProblemEntity();
    savedUser.total_resolved = 1;
    savedUser.total_submissions = 3;
    savedProblem.total_submitted = 2;
    savedProblem.total_accepted = 1;
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();
    const savedSubmission = SubmissionFactory.makeSubmissionEntity();
    const rejectedResult = new TestResult(
      StatusEnum.REJECTED,
      10,
      '0\n',
      'Wrong Answer',
      10,
      0,
    );
    const initialPoints = Number(savedUser.points);

    userRepositoryMock.findOneById.mockResolvedValue(savedUser);
    problemRepositoryMock.findById.mockResolvedValue(savedProblem);
    testCaseRepositoryMock.findByProblemId.mockResolvedValue([savedTestCase]);
    testRunnerServiceMock.runTests.mockResolvedValue(rejectedResult);
    submissionRepositoryMock.findOneUserAcceptedSubmission.mockResolvedValue(
      null,
    );
    submissionRepositoryMock.save.mockResolvedValue(savedSubmission);
    userRepositoryMock.save.mockResolvedValue(savedUser);
    problemRepositoryMock.saveExistingEntity.mockResolvedValue(savedProblem);

    await useCase.execute(createSubmissionDto);

    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        points: initialPoints,
        total_submissions: 4,
        total_resolved: 1,
      }),
      expect.any(Object),
    );
    expect(problemRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        total_submitted: 3,
        total_accepted: 1,
      }),
      expect.any(Object),
    );
  });
});
