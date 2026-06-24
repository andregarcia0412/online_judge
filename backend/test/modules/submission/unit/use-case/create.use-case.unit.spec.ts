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
    savedUser.totalSubmissions = 3;
    savedUser.totalResolved = 0;
    savedProblem.totalSubmitted = 3;
    savedProblem.totalAccepted = 1;
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

    const result = await useCase.execute(savedUser.id, createSubmissionDto);

    expect(dataSourceMock.transaction).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.findOneById).toHaveBeenCalledWith(
      savedUser.id,
      expect.any(Object),
    );
    expect(problemRepositoryMock.findById).toHaveBeenCalledWith(
      createSubmissionDto.idProblem,
      expect.any(Object),
    );
    expect(testCaseRepositoryMock.findByProblemId).toHaveBeenCalledWith(
      createSubmissionDto.idProblem,
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
      createSubmissionDto.idProblem,
      expect.any(Object),
    );
    expect(submissionRepositoryMock.save).toHaveBeenCalledWith(
      { ...createSubmissionDto, idUser: savedUser.id },
      testResult,
      expect.any(Object),
    );
    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        points: Number(savedProblem.points),
        totalSubmissions: 4,
        totalResolved: 1,
      }),
      expect.any(Object),
    );
    expect(problemRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        totalSubmitted: 4,
        totalAccepted: 2,
      }),
      expect.any(Object),
    );

    expect(result).toMatchObject({
      id: savedSubmission.id,
      idUser: savedSubmission.idUser,
      idProblem: savedSubmission.idProblem,
      text: savedSubmission.text,
      language: savedSubmission.language,
      status: savedSubmission.status,
      executionTime: savedSubmission.executionTime,
      error: savedSubmission.error,
      memoryUsageMB: savedSubmission.memoryUsageMB,
      testCasesPassed: savedSubmission.testCasesPassed,
      lastStdout: testResult.stdout,
    });
  });

  it('should throw NotFoundException when user id does not match', async () => {
    userRepositoryMock.findOneById.mockResolvedValue(null);

    const createPromise = useCase.execute(
      '123',
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
      '123',
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
      '123',
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
    savedUser.totalSubmissions = 5;
    savedUser.totalResolved = 3;
    savedProblem.totalSubmitted = 8;
    savedProblem.totalAccepted = 5;
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

    await useCase.execute(savedUser.id, createSubmissionDto);

    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        points: initialPoints,
        totalSubmissions: 6,
        totalResolved: 3,
      }),
      expect.any(Object),
    );
    expect(problemRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        totalSubmitted: 9,
        totalAccepted: 5,
      }),
      expect.any(Object),
    );
  });

  it('should not add points when submission result is not accepted', async () => {
    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
    const savedUser = UserFactory.makeUserEntity();
    const savedProblem = ProblemFactory.makeProblemEntity();
    savedUser.totalResolved = 1;
    savedUser.totalSubmissions = 3;
    savedProblem.totalSubmitted = 2;
    savedProblem.totalAccepted = 1;
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

    await useCase.execute(savedUser.id, createSubmissionDto);

    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        points: initialPoints,
        totalSubmissions: 4,
        totalResolved: 1,
      }),
      expect.any(Object),
    );
    expect(problemRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        totalSubmitted: 3,
        totalAccepted: 1,
      }),
      expect.any(Object),
    );
  });
});
