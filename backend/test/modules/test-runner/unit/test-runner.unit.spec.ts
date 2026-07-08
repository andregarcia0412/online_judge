import { BadRequestException } from '@nestjs/common';
import { ExecuteCodeDto } from 'src/shared/provider/code-runner/dto/execute-code.dto';
import { SubmissionStatusEnum } from 'src/shared/enum/submission-status';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { TestRunnerService } from 'src/modules/test-runner/test-runner.service';

const makeTestCase = (input: string, output: string): TestCase => {
  const testCase = new TestCase();
  testCase.input = input;
  testCase.output = output;
  return testCase;
};

describe('TestRunnerService', () => {
  let codeRunnerServiceMock: {
    getAllowedLanguages: jest.Mock;
    executeCode: jest.Mock;
  };
  let service: TestRunnerService;

  beforeEach(() => {
    codeRunnerServiceMock = {
      getAllowedLanguages: jest.fn().mockReturnValue(['python']),
      executeCode: jest.fn(),
    };

    service = new TestRunnerService(codeRunnerServiceMock as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw BadRequestException when language is invalid', async () => {
    const runPromise = service.runTests([], 'print("ok")', 'invalid-language');

    await expect(runPromise).rejects.toThrow(BadRequestException);
    await expect(runPromise).rejects.toThrow('Invalid language name');
    expect(codeRunnerServiceMock.getAllowedLanguages).toHaveBeenCalledTimes(1);
    expect(codeRunnerServiceMock.executeCode).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when there are no test cases', async () => {
    const runPromise = service.runTests([], 'print("ok")', 'python');

    await expect(runPromise).rejects.toThrow(BadRequestException);
    await expect(runPromise).rejects.toThrow(
      'No test cases found for this problem',
    );
    expect(codeRunnerServiceMock.getAllowedLanguages).toHaveBeenCalledTimes(1);
    expect(codeRunnerServiceMock.executeCode).not.toHaveBeenCalled();
  });

  it('should return SUBMISSION_ERROR when execution result is malformed', async () => {
    const testCases = [makeTestCase('1\n', '1\n')];

    codeRunnerServiceMock.executeCode.mockResolvedValue({
      output: '',
      errOutput: '',
      timeMs: undefined,
      memoryUsage: undefined,
      errorOcurred: false,
    });

    const result = await service.runTests(testCases, 'print(1)', 'python');

    expect(result.status).toBe(SubmissionStatusEnum.SUBMISSION_ERROR);
    expect(result.executionTime).toBe(0);
    expect(result.stdout).toBeNull();
    expect(result.error).toBe('Execution failed');
    expect(result.memoryUsageMB).toBe(0);
    expect(result.testCasesPassed).toBe(0);
  });

  it('should return COMPILATION_ERROR and surface the compiler stderr', async () => {
    const testCases = [makeTestCase('1\n', '1\n')];

    codeRunnerServiceMock.executeCode.mockResolvedValue(
      new ExecuteCodeDto(
        '',
        'error: cannot find symbol',
        0,
        true,
        0,
        SubmissionStatusEnum.COMPILATION_ERROR,
      ),
    );

    const result = await service.runTests(testCases, 'bad code', 'python');

    expect(result.status).toBe(SubmissionStatusEnum.COMPILATION_ERROR);
    expect(result.stdout).toBeNull();
    expect(result.error).toBe('error: cannot find symbol');
    expect(result.executionTime).toBe(0);
    expect(result.memoryUsageMB).toBe(0);
    expect(result.testCasesPassed).toBe(0);
  });

  it('should return TIME_LIMIT_EXCEEDED when the runner reports a timeout', async () => {
    const testCases = [makeTestCase('1\n', '1\n')];

    codeRunnerServiceMock.executeCode.mockResolvedValue(
      new ExecuteCodeDto(
        '',
        'time limit exceeded',
        5000,
        true,
        8.5,
        SubmissionStatusEnum.TIME_LIMIT_EXCEEDED,
      ),
    );

    const result = await service.runTests(
      testCases,
      'while True: pass',
      'python',
    );

    expect(result.status).toBe(SubmissionStatusEnum.TIME_LIMIT_EXCEEDED);
    expect(result.stdout).toBeNull();
    expect(result.error).toBe('time limit exceeded');
    expect(result.testCasesPassed).toBe(0);
  });

  it('should return RUNTIME_ERROR when execution errored without an explicit status', async () => {
    const testCases = [makeTestCase('2\n', '4\n')];

    codeRunnerServiceMock.executeCode.mockResolvedValue(
      new ExecuteCodeDto('', 'ZeroDivisionError', 14.7, true, 12.5),
    );

    const result = await service.runTests(testCases, 'print(1/0)', 'python');

    expect(result.status).toBe(SubmissionStatusEnum.RUNTIME_ERROR);
    expect(result.stdout).toBeNull();
    expect(result.error).toBe('ZeroDivisionError');
    expect(result.testCasesPassed).toBe(0);
  });

  it('should return WRONG_ANSWER when the value differs and not leak stderr on a clean run', async () => {
    const testCases = [makeTestCase('2\n', '4\n')];

    codeRunnerServiceMock.executeCode.mockResolvedValue(
      new ExecuteCodeDto('5\n', 'ignored stderr', 14.7, false, 12.5),
    );

    const result = await service.runTests(testCases, 'print(5)', 'python');

    expect(result.status).toBe(SubmissionStatusEnum.WRONG_ANSWER);
    expect(result.executionTime).toBe(14);
    expect(result.stdout).toBe('5\n');
    expect(result.error).toBeNull();
    expect(result.memoryUsageMB).toBe(12.5);
    expect(result.testCasesPassed).toBe(0);
  });

  it('should count earlier passing cases before a WRONG_ANSWER', async () => {
    const testCases = [makeTestCase('1\n', '1\n'), makeTestCase('2\n', '2\n')];

    codeRunnerServiceMock.executeCode
      .mockResolvedValueOnce(new ExecuteCodeDto('1\n', '', 8.2, false, 6.4))
      .mockResolvedValueOnce(new ExecuteCodeDto('9\n', '', 10.9, false, 9.25));

    const result = await service.runTests(testCases, 'code', 'python');

    expect(result.status).toBe(SubmissionStatusEnum.WRONG_ANSWER);
    expect(result.testCasesPassed).toBe(1);
    expect(result.stdout).toBe('9\n');
  });

  it('should return PRESENTATION_ERROR when only whitespace differs (trailing space)', async () => {
    const testCases = [makeTestCase('6\n', '0 1 1 2 3 5\n')];

    codeRunnerServiceMock.executeCode.mockResolvedValue(
      new ExecuteCodeDto('0 1 1 2 3 5 \n', '', 12.0, false, 7.0),
    );

    const result = await service.runTests(testCases, 'code', 'python');

    expect(result.status).toBe(SubmissionStatusEnum.PRESENTATION_ERROR);
    expect(result.stdout).toBe('0 1 1 2 3 5 \n');
    expect(result.error).toBeNull();
    expect(result.executionTime).toBe(12);
    expect(result.memoryUsageMB).toBe(7.0);
    expect(result.testCasesPassed).toBe(0);
  });

  it('should return PRESENTATION_ERROR when only whitespace differs (missing trailing newline)', async () => {
    const testCases = [makeTestCase('1\n', '42\n')];

    codeRunnerServiceMock.executeCode.mockResolvedValue(
      new ExecuteCodeDto('42', '', 3.0, false, 5.0),
    );

    const result = await service.runTests(testCases, 'code', 'python');

    expect(result.status).toBe(SubmissionStatusEnum.PRESENTATION_ERROR);
    expect(result.testCasesPassed).toBe(0);
  });

  it('should return ACCEPTED with biggest runtime and memory usage', async () => {
    const testCases = [makeTestCase('1\n', '1\n'), makeTestCase('2\n', '2\n')];

    codeRunnerServiceMock.executeCode
      .mockResolvedValueOnce(new ExecuteCodeDto('1\n', '', 8.2, false, 6.4))
      .mockResolvedValueOnce(new ExecuteCodeDto('2\n', '', 10.9, false, 9.25));

    const result = await service.runTests(
      testCases,
      'print(input())',
      'python',
    );

    expect(codeRunnerServiceMock.getAllowedLanguages).toHaveBeenCalledTimes(1);
    expect(codeRunnerServiceMock.executeCode).toHaveBeenCalledTimes(2);
    expect(result.status).toBe(SubmissionStatusEnum.ACCEPTED);
    expect(result.executionTime).toBe(10);
    expect(result.stdout).toBe('2\n');
    expect(result.error).toBeNull();
    expect(result.memoryUsageMB).toBe(9.25);
    expect(result.testCasesPassed).toBe(2);
  });
});
