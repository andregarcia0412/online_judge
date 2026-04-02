import { NotFoundException } from '@nestjs/common';
import { SubmissionService } from 'src/modules/submission/submission.service';
import { StatusEnum } from 'src/modules/submission/enum/submission-status';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { ProblemFactory } from 'test/factories/problem.factory';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';
import { TestRunnerFactory } from 'test/factories/test-runner.factory';
import { UserFactory } from 'test/factories/user.factory';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';

describe('Create Submission', () => {
  it('should run code with test cases, add points to user when it is first submission and return ReturnSubmissionDto when user, problem and test cases exist', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
    const savedUser = UserFactory.makeUserEntity();
    const savedProblem = ProblemFactory.makeProblemEntity();
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();

    const createdSubmission = SubmissionFactory.makeSubmissionEntity();
    const savedSubmission = SubmissionFactory.makeSubmissionEntity();
    const testResult = TestRunnerFactory.makeTestResult();

    userRepositoryMock.findOneBy.mockResolvedValue(savedUser);
    problemRepositoryMock.findOneBy.mockResolvedValue(savedProblem);
    testCaseRepositoryMock.findBy.mockResolvedValue([savedTestCase]);
    testRunnerServiceMock.runTests.mockResolvedValue(testResult);
    submissionRepositoryMock.findOne.mockResolvedValue(null);
    submissionRepositoryMock.create.mockReturnValue(createdSubmission);
    submissionRepositoryMock.save.mockResolvedValue(savedSubmission);
    userRepositoryMock.save.mockResolvedValue(savedUser);

    const result = await service.create(createSubmissionDto);

    expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
      id: createSubmissionDto.id_user,
    });
    expect(problemRepositoryMock.findOneBy).toHaveBeenCalledWith({
      id: createSubmissionDto.id_problem,
    });
    expect(testCaseRepositoryMock.findBy).toHaveBeenCalledWith({
      id_problem: createSubmissionDto.id_problem,
    });
    expect(testRunnerServiceMock.runTests).toHaveBeenCalledWith(
      [savedTestCase],
      createSubmissionDto.text,
      createSubmissionDto.language,
    );

    expect(submissionRepositoryMock.create).toHaveBeenCalledWith({
      ...createSubmissionDto,
      status: testResult.status,
      execution_time: testResult.execution_time,
      error: testResult.error,
      memory_usage_MB: testResult.memory_usage_MB,
      test_cases_passed: testResult.test_cases_passed,
    });
    expect(submissionRepositoryMock.save).toHaveBeenCalledWith(
      createdSubmission,
    );
    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ points: Number(savedProblem.points) }),
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
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const createPromise = service.create(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('User not found');
  });

  it('should throw NotFoundException when problem id does not match', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    userRepositoryMock.findOneBy.mockResolvedValue(
      UserFactory.makeUserEntity(),
    );

    const createPromise = service.create(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('Problem not found');
  });

  it('should throw NotFoundException when there are no test cases', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    userRepositoryMock.findOneBy.mockResolvedValue(
      UserFactory.makeUserEntity(),
    );

    problemRepositoryMock.findOneBy.mockResolvedValue(
      ProblemFactory.makeProblemRepositoryMock(),
    );

    const createPromise = service.create(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow(
      'There are no test cases for this problem',
    );
  });

  it('should not add points when user already has an accepted submission in the same language', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
    const savedUser = UserFactory.makeUserEntity();
    const savedProblem = ProblemFactory.makeProblemEntity();
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();
    const createdSubmission = SubmissionFactory.makeSubmissionEntity();
    const savedSubmission = SubmissionFactory.makeSubmissionEntity();
    const existingAcceptedSubmission = SubmissionFactory.makeSubmissionEntity();
    const testResult = TestRunnerFactory.makeTestResult();
    const initialPoints = Number(savedUser.points);

    userRepositoryMock.findOneBy.mockResolvedValue(savedUser);
    problemRepositoryMock.findOneBy.mockResolvedValue(savedProblem);
    testCaseRepositoryMock.findBy.mockResolvedValue([savedTestCase]);
    testRunnerServiceMock.runTests.mockResolvedValue(testResult);
    submissionRepositoryMock.findOne.mockResolvedValue(
      existingAcceptedSubmission,
    );
    submissionRepositoryMock.create.mockReturnValue(createdSubmission);
    submissionRepositoryMock.save.mockResolvedValue(savedSubmission);
    userRepositoryMock.save.mockResolvedValue(savedUser);

    await service.create(createSubmissionDto);

    expect(submissionRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        id_user: savedUser.id,
        status: StatusEnum.ACCEPTED,
        language: createSubmissionDto.language,
      },
    });
    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ points: initialPoints }),
    );
  });

  it('should not add points when submission result is not accepted', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
    const savedUser = UserFactory.makeUserEntity();
    const savedProblem = ProblemFactory.makeProblemEntity();
    const savedTestCase = TestCaseFactory.makeTestCaseEntity();
    const createdSubmission = SubmissionFactory.makeSubmissionEntity();
    const savedSubmission = SubmissionFactory.makeSubmissionEntity();
    const rejectedResult = new TestResult(
      StatusEnum.REJECTED,
      10,
      '0\\n',
      'Wrong Answer',
      10,
      0,
    );
    const initialPoints = Number(savedUser.points);

    userRepositoryMock.findOneBy.mockResolvedValue(savedUser);
    problemRepositoryMock.findOneBy.mockResolvedValue(savedProblem);
    testCaseRepositoryMock.findBy.mockResolvedValue([savedTestCase]);
    testRunnerServiceMock.runTests.mockResolvedValue(rejectedResult);
    submissionRepositoryMock.findOne.mockResolvedValue(null);
    submissionRepositoryMock.create.mockReturnValue(createdSubmission);
    submissionRepositoryMock.save.mockResolvedValue(savedSubmission);
    userRepositoryMock.save.mockResolvedValue(savedUser);

    await service.create(createSubmissionDto);

    expect(userRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ points: initialPoints }),
    );
  });
});

describe('Create Playground Submission', () => {
  it('should return TestResult when problem and test cases are found', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const testCases = [TestCaseFactory.makeTestCaseEntity()];

    problemRepositoryMock.findOneBy.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );
    testCaseRepositoryMock.findBy.mockResolvedValue(testCases);

    testRunnerServiceMock.runTests.mockResolvedValue(
      TestRunnerFactory.makeTestResult(),
    );

    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();

    const result =
      await service.createPlaygroundSubmission(createSubmissionDto);

    expect(problemRepositoryMock.findOneBy).toHaveBeenCalledWith({
      id: createSubmissionDto.id_problem,
    });

    expect(testCaseRepositoryMock.findBy).toHaveBeenLastCalledWith({
      id_problem: createSubmissionDto.id_problem,
    });

    expect(testRunnerServiceMock.runTests).toHaveBeenCalledWith(
      testCases,
      createSubmissionDto.text,
      createSubmissionDto.language,
    );

    expect(result).toBeInstanceOf(TestResult);
  });

  it('should throw NotFoundException when problem id does not match', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    problemRepositoryMock.findOneBy.mockResolvedValue(null);

    const createPromise = service.createPlaygroundSubmission(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow('Problem not found');
  });

  it('should throw NotFoundException when test cases are not found', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    problemRepositoryMock.findOneBy.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );

    testCaseRepositoryMock.findBy.mockResolvedValue([]);

    const createPromise = service.createPlaygroundSubmission(
      SubmissionFactory.makeCreateSubmissionDto(),
    );

    await expect(createPromise).rejects.toThrow(NotFoundException);
    await expect(createPromise).rejects.toThrow(
      'There are no test cases for this problem',
    );
  });

  it('should return the same TestResult received from test runner', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
    const expectedResult = new TestResult(
      StatusEnum.REJECTED,
      12,
      'output\\n',
      'Runtime Error',
      16,
      1,
    );

    problemRepositoryMock.findOneBy.mockResolvedValue(
      ProblemFactory.makeProblemEntity(),
    );
    testCaseRepositoryMock.findBy.mockResolvedValue([
      TestCaseFactory.makeTestCaseEntity(),
    ]);
    testRunnerServiceMock.runTests.mockResolvedValue(expectedResult);

    const result =
      await service.createPlaygroundSubmission(createSubmissionDto);

    expect(result).toEqual(expectedResult);
  });
});

describe('Find All Submissions', () => {
  it('should return a list of Submission', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const savedEntity = SubmissionFactory.makeSubmissionEntity();
    submissionRepositoryMock.find.mockResolvedValue([savedEntity]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ReturnSubmissionDto);
    expect(result[0]).toMatchObject({
      id: savedEntity.id,
      id_user: savedEntity.id_user,
      id_problem: savedEntity.id_problem,
      text: savedEntity.text,
      language: savedEntity.language,
      status: savedEntity.status,
      execution_time: savedEntity.execution_time,
      submission_date: savedEntity.submission_date,
      error: savedEntity.error,
      memory_usage_MB: savedEntity.memory_usage_MB,
      test_cases_passed: savedEntity.test_cases_passed,
    });
  });
});

describe('Find Submission By Id', () => {
  it('should return a ReturnSubmissionDto when id matches', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const savedEntity = SubmissionFactory.makeSubmissionEntity();
    submissionRepositoryMock.findOneBy.mockResolvedValue(savedEntity);

    const result = await service.findOneById(savedEntity.id);

    expect(submissionRepositoryMock.findOneBy).toHaveBeenCalledWith({
      id: savedEntity.id,
    });
    expect(result).toBeInstanceOf(ReturnSubmissionDto);
    expect(result).toMatchObject({
      id: savedEntity.id,
      id_user: savedEntity.id_user,
      id_problem: savedEntity.id_problem,
      text: savedEntity.text,
      language: savedEntity.language,
      status: savedEntity.status,
      execution_time: savedEntity.execution_time,
      submission_date: savedEntity.submission_date,
      error: savedEntity.error,
      memory_usage_MB: savedEntity.memory_usage_MB,
      test_cases_passed: savedEntity.test_cases_passed,
    });
  });

  it('should throw NotFoundException when id does not match', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    submissionRepositoryMock.findOneBy.mockResolvedValue(null);

    const findPromise = service.findOneById('123');

    await expect(findPromise).rejects.toThrow(NotFoundException);
    await expect(findPromise).rejects.toThrow('Submission not found');
  });
});

describe('Find All Submissions By User Id', () => {
  it('should return a list of ReturnSubmissionDto when user id matches', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const savedSubmission = SubmissionFactory.makeSubmissionEntity();
    const savedUser = UserFactory.makeUserEntity();

    submissionRepositoryMock.findBy.mockResolvedValue([savedSubmission]);

    const result = await service.findAllByUserId(savedUser.id);

    expect(submissionRepositoryMock.findBy).toHaveBeenCalledWith({
      id_user: savedUser.id,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ReturnSubmissionDto);
    expect(result[0]).toMatchObject({
      id: savedSubmission.id,
      id_user: savedSubmission.id_user,
      id_problem: savedSubmission.id_problem,
      text: savedSubmission.text,
      language: savedSubmission.language,
      status: savedSubmission.status,
      execution_time: savedSubmission.execution_time,
      submission_date: savedSubmission.submission_date,
      error: savedSubmission.error,
      memory_usage_MB: savedSubmission.memory_usage_MB,
      test_cases_passed: savedSubmission.test_cases_passed,
    });
  });
});

describe('Update Submission', () => {
  it('should call repository.update and return UpdateResult', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const id = '123';
    const updateSubmissionDto = { text: 'print("Updated")' };
    const expectedUpdateResult = { affected: 1, generatedMaps: [], raw: [] };

    submissionRepositoryMock.update.mockResolvedValue(expectedUpdateResult);

    const result = await service.update(id, updateSubmissionDto as any);

    expect(submissionRepositoryMock.update).toHaveBeenCalledWith(
      id,
      updateSubmissionDto,
    );
    expect(result).toEqual(expectedUpdateResult);
  });
});

describe('Remove Submission', () => {
  it('should call repository.delete and return DeleteResult', async () => {
    const submissionRepositoryMock =
      SubmissionFactory.makeSubmissionRepositoryMock();
    const userRepositoryMock = UserFactory.makeUserRepositoryMock();
    const problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    const testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    const testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();

    const service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
    );

    const id = '123';
    const expectedDeleteResult = { affected: 1, raw: [] };

    submissionRepositoryMock.delete.mockResolvedValue(expectedDeleteResult);

    const result = await service.remove(id);

    expect(submissionRepositoryMock.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual(expectedDeleteResult);
  });
});
