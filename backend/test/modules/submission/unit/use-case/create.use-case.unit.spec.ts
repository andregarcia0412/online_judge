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
  let problemServiceMock: {
    findProblemEntityById: jest.Mock;
    update: jest.Mock;
  };
  let testCaseServiceMock: {
    findAllEntitiesByProblemId: jest.Mock;
  };
  let testRunnerServiceMock: ReturnType<
    typeof TestRunnerFactory.makeTestResultServiceMock
  >;
  let userServiceMock: {
    findUserEntityById: jest.Mock;
    update: jest.Mock;
    updateUserStreakOnSubmission: jest.Mock;
  };
  let txHostMock: {
    withTransaction: jest.Mock;
  };
  let useCase: CreateSubmissionUseCase;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    problemServiceMock = {
      findProblemEntityById: jest.fn(),
      update: jest.fn(),
    };
    testCaseServiceMock = {
      findAllEntitiesByProblemId: jest.fn(),
    };
    testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();
    userServiceMock = {
      findUserEntityById: jest.fn(),
      update: jest.fn(),
      updateUserStreakOnSubmission: jest.fn(),
    };
    txHostMock = {
      withTransaction: jest.fn().mockImplementation(async (callback) =>
        callback(),
      ),
    };

    useCase = new CreateSubmissionUseCase(
      submissionRepositoryMock as any,
      problemServiceMock as any,
      testCaseServiceMock as any,
      testRunnerServiceMock as any,
      userServiceMock as any,
      txHostMock as any,
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

    userServiceMock.findUserEntityById.mockResolvedValue(savedUser);
    problemServiceMock.findProblemEntityById.mockResolvedValue(savedProblem);
    testCaseServiceMock.findAllEntitiesByProblemId.mockResolvedValue([
      savedTestCase,
    ]);
    testRunnerServiceMock.runTests.mockResolvedValue(testResult);
    submissionRepositoryMock.findOneUserAcceptedSubmission.mockResolvedValue(
      null,
    );
    submissionRepositoryMock.save.mockResolvedValue(savedSubmission);
    userServiceMock.update.mockResolvedValue(savedUser);
    problemServiceMock.update.mockResolvedValue(savedProblem);

    const result = await useCase.execute(savedUser.id, createSubmissionDto);

    expect(txHostMock.withTransaction).toHaveBeenCalledTimes(1);
    expect(userServiceMock.findUserEntityById).toHaveBeenCalledWith(
      savedUser.id,
    );
    expect(problemServiceMock.findProblemEntityById).toHaveBeenCalledWith(
      createSubmissionDto.idProblem,
    );
    expect(testCaseServiceMock.findAllEntitiesByProblemId).toHaveBeenCalledWith(
      createSubmissionDto.idProblem,
    );
    expect(testRunnerServiceMock.runTests).toHaveBeenCalledWith(
      [savedTestCase],
      createSubmissionDto.text,
      createSubmissionDto.language,
    );
    expect(userServiceMock.updateUserStreakOnSubmission).toHaveBeenCalledWith(
      savedUser,
    );

    expect(
      submissionRepositoryMock.findOneUserAcceptedSubmission,
    ).toHaveBeenCalledWith(
      savedUser.id,
      createSubmissionDto.language,
      createSubmissionDto.idProblem,
    );
    expect(submissionRepositoryMock.save).toHaveBeenCalledWith(
      { ...createSubmissionDto, idUser: savedUser.id },
      testResult,
    );
    expect(userServiceMock.update).toHaveBeenCalledWith(
      savedUser.id,
      expect.objectContaining({
        points: Number(savedProblem.points),
        totalSubmissions: 4,
        totalResolved: 1,
      }),
    );
    expect(problemServiceMock.update).toHaveBeenCalledWith(
      savedProblem.id,
      expect.objectContaining({
        totalSubmitted: 4,
        totalAccepted: 2,
      }),
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
    userServiceMock.findUserEntityById.mockRejectedValue(
      new NotFoundException('User not found'),
    );

    const createPromise = useCase.execute(
      '123',
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('User not found');

    expect(userServiceMock.updateUserStreakOnSubmission).not.toHaveBeenCalled();
    expect(txHostMock.withTransaction).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when problem id does not match', async () => {
    userServiceMock.findUserEntityById.mockResolvedValue(
      UserFactory.makeUserEntity(),
    );
    problemServiceMock.findProblemEntityById.mockRejectedValue(
      new NotFoundException('Problem not found'),
    );

    const createPromise = useCase.execute(
      '123',
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('Problem not found');
  });

  it('should throw NotFoundException when there are no test cases', async () => {
    userServiceMock.findUserEntityById.mockResolvedValue(
      UserFactory.makeUserEntity(),
    );
    problemServiceMock.findProblemEntityById.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );
    testCaseServiceMock.findAllEntitiesByProblemId.mockResolvedValue([]);

    const createPromise = useCase.execute(
      '123',
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow(
      'There are no test cases for this problem',
    );
  });

  it('should still count the accepted submission but not re-award points when user already has accepted submission', async () => {
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

    userServiceMock.findUserEntityById.mockResolvedValue(savedUser);
    problemServiceMock.findProblemEntityById.mockResolvedValue(savedProblem);
    testCaseServiceMock.findAllEntitiesByProblemId.mockResolvedValue([
      savedTestCase,
    ]);
    testRunnerServiceMock.runTests.mockResolvedValue(testResult);
    submissionRepositoryMock.findOneUserAcceptedSubmission.mockResolvedValue(
      existingAcceptedSubmission,
    );
    submissionRepositoryMock.save.mockResolvedValue(savedSubmission);
    userServiceMock.update.mockResolvedValue(savedUser);
    problemServiceMock.update.mockResolvedValue(savedProblem);

    await useCase.execute(savedUser.id, createSubmissionDto);

    expect(userServiceMock.update).toHaveBeenCalledWith(
      savedUser.id,
      expect.objectContaining({
        points: initialPoints,
        totalSubmissions: 6,
        totalResolved: 3,
      }),
    );
    expect(problemServiceMock.update).toHaveBeenCalledWith(
      savedProblem.id,
      expect.objectContaining({
        totalSubmitted: 9,
        totalAccepted: 6,
      }),
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

    userServiceMock.findUserEntityById.mockResolvedValue(savedUser);
    problemServiceMock.findProblemEntityById.mockResolvedValue(savedProblem);
    testCaseServiceMock.findAllEntitiesByProblemId.mockResolvedValue([
      savedTestCase,
    ]);
    testRunnerServiceMock.runTests.mockResolvedValue(rejectedResult);
    submissionRepositoryMock.findOneUserAcceptedSubmission.mockResolvedValue(
      null,
    );
    submissionRepositoryMock.save.mockResolvedValue(savedSubmission);
    userServiceMock.update.mockResolvedValue(savedUser);
    problemServiceMock.update.mockResolvedValue(savedProblem);

    await useCase.execute(savedUser.id, createSubmissionDto);

    expect(userServiceMock.update).toHaveBeenCalledWith(
      savedUser.id,
      expect.objectContaining({
        points: initialPoints,
        totalSubmissions: 4,
        totalResolved: 1,
      }),
    );
    expect(problemServiceMock.update).toHaveBeenCalledWith(
      savedProblem.id,
      expect.objectContaining({
        totalSubmitted: 3,
        totalAccepted: 1,
      }),
    );
  });
});
