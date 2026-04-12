import { NotFoundException } from '@nestjs/common';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';
import { StatusEnum } from 'src/modules/submission/enum/submission-status';
import { SubmissionService } from 'src/modules/submission/submission.service';
import { TestResult } from 'src/modules/test-runner/dto/test-result.dto';
import { ProblemFactory } from 'test/factories/problem.factory';
import { SubmissionFactory } from 'test/factories/submission.factory';
import { TestCaseFactory } from 'test/factories/test-case.factory';
import { TestRunnerFactory } from 'test/factories/test-runner.factory';
import { UserFactory } from 'test/factories/user.factory';

describe('SubmissionService', () => {
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
  let service: SubmissionService;

  beforeEach(() => {
    submissionRepositoryMock = SubmissionFactory.makeSubmissionRepositoryMock();
    userRepositoryMock = UserFactory.makeUserRepositoryMock();
    problemRepositoryMock = ProblemFactory.makeProblemRepositoryMock();
    testCaseRepositoryMock = TestCaseFactory.makeTestCaseRepositoryMock();
    testRunnerServiceMock = TestRunnerFactory.makeTestResultServiceMock();
    userServiceMock = {
      updateUserStreakOnSubmission: jest.fn(),
    };

    service = new SubmissionService(
      submissionRepositoryMock as any,
      userRepositoryMock as any,
      problemRepositoryMock as any,
      testCaseRepositoryMock as any,
      testRunnerServiceMock as any,
      userServiceMock as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Create Submission', () => {
    it('should run code with test cases, add points to user when it is first submission and return ReturnSubmissionDto when user, problem and test cases exist', async () => {
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
      submissionRepositoryMock.createAndSave.mockResolvedValue(savedSubmission);
      userRepositoryMock.save.mockResolvedValue(savedUser);
      problemRepositoryMock.saveExistingEntity.mockResolvedValue(savedProblem);

      const result = await service.create(createSubmissionDto);

      expect(userRepositoryMock.findOneById).toHaveBeenCalledWith(
        createSubmissionDto.id_user,
      );
      expect(problemRepositoryMock.findById).toHaveBeenCalledWith(
        createSubmissionDto.id_problem,
      );
      expect(testCaseRepositoryMock.findByProblemId).toHaveBeenCalledWith(
        createSubmissionDto.id_problem,
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
        createSubmissionDto.id_problem,
      );
      expect(submissionRepositoryMock.createAndSave).toHaveBeenCalledWith(
        createSubmissionDto,
        testResult,
      );
      expect(userRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          points: Number(savedProblem.points),
          total_submissions: 4,
          total_resolved: 1,
        }),
      );
      expect(problemRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(
        expect.objectContaining({
          total_submitted: 4,
          total_accepted: 2,
        }),
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
      const createPromise = service.create(
        SubmissionFactory.makeCreateSubmissionDto(),
      );

      await expect(createPromise).rejects.toThrow(NotFoundException);
      await expect(createPromise).rejects.toThrow('User not found');
    });

    it('should throw NotFoundException when problem id does not match', async () => {
      userRepositoryMock.findOneById.mockResolvedValue(
        UserFactory.makeUserEntity(),
      );

      const createPromise = service.create(
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

      const createPromise = service.create(
        SubmissionFactory.makeCreateSubmissionDto(),
      );

      await expect(createPromise).rejects.toThrow(NotFoundException);
      await expect(createPromise).rejects.toThrow(
        'There are no test cases for this problem',
      );
    });

    it('should not add points when user already has an accepted submission in the same language', async () => {
      const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
      const savedUser = UserFactory.makeUserEntity();
      const savedProblem = ProblemFactory.makeProblemEntity();
      savedUser.total_submissions = 5;
      savedUser.total_resolved = 3;
      savedProblem.total_submitted = 8;
      savedProblem.total_accepted = 5;
      const savedTestCase = TestCaseFactory.makeTestCaseEntity();
      const savedSubmission = SubmissionFactory.makeSubmissionEntity();
      const existingAcceptedSubmission =
        SubmissionFactory.makeSubmissionEntity();
      const testResult = TestRunnerFactory.makeTestResult();
      const initialPoints = Number(savedUser.points);

      userRepositoryMock.findOneById.mockResolvedValue(savedUser);
      problemRepositoryMock.findById.mockResolvedValue(savedProblem);
      testCaseRepositoryMock.findByProblemId.mockResolvedValue([savedTestCase]);
      testRunnerServiceMock.runTests.mockResolvedValue(testResult);
      submissionRepositoryMock.findOneUserAcceptedSubmission.mockResolvedValue(
        existingAcceptedSubmission,
      );
      submissionRepositoryMock.createAndSave.mockResolvedValue(savedSubmission);
      userRepositoryMock.save.mockResolvedValue(savedUser);
      problemRepositoryMock.saveExistingEntity.mockResolvedValue(savedProblem);

      await service.create(createSubmissionDto);

      expect(
        submissionRepositoryMock.findOneUserAcceptedSubmission,
      ).toHaveBeenCalledWith(
        savedUser.id,
        createSubmissionDto.language,
        createSubmissionDto.id_problem,
      );
      expect(userRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          points: initialPoints,
          total_submissions: 6,
          total_resolved: 3,
        }),
      );
      expect(problemRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(
        expect.objectContaining({
          total_submitted: 9,
          total_accepted: 5,
        }),
      );
      expect(userServiceMock.updateUserStreakOnSubmission).toHaveBeenCalledWith(
        savedUser,
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
        '0\\n',
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
      submissionRepositoryMock.createAndSave.mockResolvedValue(savedSubmission);
      userRepositoryMock.save.mockResolvedValue(savedUser);
      problemRepositoryMock.saveExistingEntity.mockResolvedValue(savedProblem);

      await service.create(createSubmissionDto);

      expect(userRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          points: initialPoints,
          total_submissions: 4,
          total_resolved: 1,
        }),
      );
      expect(problemRepositoryMock.saveExistingEntity).toHaveBeenCalledWith(
        expect.objectContaining({
          total_submitted: 3,
          total_accepted: 1,
        }),
      );
      expect(userServiceMock.updateUserStreakOnSubmission).toHaveBeenCalledWith(
        savedUser,
      );
    });

    it('should not update streak when user is not found', async () => {
      userRepositoryMock.findOneById.mockResolvedValue(null);

      await expect(
        service.create(SubmissionFactory.makeCreateSubmissionDto()),
      ).rejects.toThrow('User not found');

      expect(
        userServiceMock.updateUserStreakOnSubmission,
      ).not.toHaveBeenCalled();
    });
  });

  describe('Create Playground Submission', () => {
    it('should return TestResult when problem and test cases are found', async () => {
      const testCases = [TestCaseFactory.makeTestCaseEntity()];

      problemRepositoryMock.findById.mockResolvedValue(
        ProblemFactory.makeProblemEntity(),
      );
      testCaseRepositoryMock.findByProblemId.mockResolvedValue(testCases);

      testRunnerServiceMock.runTests.mockResolvedValue(
        TestRunnerFactory.makeTestResult(),
      );

      const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();

      const result =
        await service.createPlaygroundSubmission(createSubmissionDto);

      expect(problemRepositoryMock.findById).toHaveBeenCalledWith(
        createSubmissionDto.id_problem,
      );

      expect(testCaseRepositoryMock.findByProblemId).toHaveBeenLastCalledWith(
        createSubmissionDto.id_problem,
      );

      expect(testRunnerServiceMock.runTests).toHaveBeenCalledWith(
        testCases,
        createSubmissionDto.text,
        createSubmissionDto.language,
      );

      expect(result).toBeInstanceOf(TestResult);
    });

    it('should throw NotFoundException when problem id does not match', async () => {
      problemRepositoryMock.findById.mockResolvedValue(null);

      const createPromise = service.createPlaygroundSubmission(
        SubmissionFactory.makeCreateSubmissionDto(),
      );

      await expect(createPromise).rejects.toThrow(NotFoundException);
      await expect(createPromise).rejects.toThrow('Problem not found');
    });

    it('should throw NotFoundException when test cases are not found', async () => {
      problemRepositoryMock.findById.mockResolvedValue(
        ProblemFactory.makeProblemEntity(),
      );

      testCaseRepositoryMock.findByProblemId.mockResolvedValue([]);

      const createPromise = service.createPlaygroundSubmission(
        SubmissionFactory.makeCreateSubmissionDto(),
      );

      await expect(createPromise).rejects.toThrow(NotFoundException);
      await expect(createPromise).rejects.toThrow(
        'There are no test cases for this problem',
      );
    });

    it('should return the same TestResult received from test runner', async () => {
      const createSubmissionDto = SubmissionFactory.makeCreateSubmissionDto();
      const expectedResult = new TestResult(
        StatusEnum.REJECTED,
        12,
        'output\\n',
        'Runtime Error',
        16,
        1,
      );

      problemRepositoryMock.findById.mockResolvedValue(
        ProblemFactory.makeProblemEntity(),
      );
      testCaseRepositoryMock.findByProblemId.mockResolvedValue([
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
      const savedEntity = SubmissionFactory.makeSubmissionEntity();
      submissionRepositoryMock.findAll.mockResolvedValue([savedEntity]);

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
      const savedEntity = SubmissionFactory.makeSubmissionEntity();
      submissionRepositoryMock.findOneById.mockResolvedValue(savedEntity);

      const result = await service.findOneById(savedEntity.id);

      expect(submissionRepositoryMock.findOneById).toHaveBeenCalledWith(
        savedEntity.id,
      );
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
      submissionRepositoryMock.findOneById.mockResolvedValue(null);

      const findPromise = service.findOneById('123');

      await expect(findPromise).rejects.toThrow(NotFoundException);
      await expect(findPromise).rejects.toThrow('Submission not found');
    });
  });

  describe('Find All Submissions By User Id', () => {
    it('should return a list of ReturnSubmissionDto when user id matches', async () => {
      const savedSubmission = SubmissionFactory.makeSubmissionEntity();
      const savedUser = UserFactory.makeUserEntity();

      submissionRepositoryMock.findAllByUserId.mockResolvedValue([
        savedSubmission,
      ]);

      const result = await service.findAllByUserId(savedUser.id);

      expect(submissionRepositoryMock.findAllByUserId).toHaveBeenCalledWith(
        savedUser.id,
      );

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
      const id = '123';
      const updateSubmissionDto = { text: 'print("Updated")' };
      const expectedUpdateResult = { affected: 1, generatedMaps: [], raw: [] };

      submissionRepositoryMock.updateById.mockResolvedValue(
        expectedUpdateResult,
      );

      const result = await service.update(id, updateSubmissionDto as any);

      expect(submissionRepositoryMock.updateById).toHaveBeenCalledWith(
        id,
        updateSubmissionDto,
      );
      expect(result).toEqual(expectedUpdateResult);
    });
  });

  describe('Remove Submission', () => {
    it('should call repository.delete and return DeleteResult', async () => {
      const id = '123';
      const expectedDeleteResult = { affected: 1, raw: [] };

      submissionRepositoryMock.delete.mockResolvedValue(expectedDeleteResult);

      const result = await service.remove(id);

      expect(submissionRepositoryMock.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedDeleteResult);
    });
  });
});
