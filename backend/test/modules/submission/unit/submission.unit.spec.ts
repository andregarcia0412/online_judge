import { NotFoundException } from '@nestjs/common';
import { SubmissionService } from 'src/modules/submission/submission.service';
import { ProblemFactory } from 'test/factories/problem.factory';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';
import { TestRunnerFactory } from 'test/factories/test-runner.factory';
import { UserFactory } from 'test/factories/user.factory';

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
});
