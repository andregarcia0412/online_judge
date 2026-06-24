import { BadRequestException } from '@nestjs/common';
import { ExecuteCodeDto } from 'src/shared/provider/code-runner/dto/execute-code.dto';
import { StatusEnum } from 'src/modules/submission/enum/submission-status';
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

  it('should return REJECTED when execution result is malformed', async () => {
    const testCases = [makeTestCase('1\n', '1\n')];

    codeRunnerServiceMock.executeCode.mockResolvedValue({
      output: '',
      errOutput: '',
      timeMs: undefined,
      memoryUsage: undefined,
      errorOcurred: false,
    });

    const result = await service.runTests(testCases, 'print(1)', 'python');

    expect(result.status).toBe(StatusEnum.REJECTED);
    expect(result.executionTime).toBe(0);
    expect(result.stdout).toBeNull();
    expect(result.error).toBe('Execution failed');
    expect(result.memoryUsageMB).toBe(0);
    expect(result.testCasesPassed).toBe(0);
  });

  it('should return REJECTED when output mismatches and include stderr only when execution errored', async () => {
    const testCases = [makeTestCase('2\n', '4\n')];

    codeRunnerServiceMock.executeCode.mockResolvedValue(
      new ExecuteCodeDto('3\n', 'runtime error', 14.7, true, 12.5),
    );

    const result = await service.runTests(testCases, 'print(3)', 'python');

    expect(result.status).toBe(StatusEnum.REJECTED);
    expect(result.executionTime).toBe(14);
    expect(result.stdout).toBe('3\n');
    expect(result.error).toBe('runtime error');
    expect(result.memoryUsageMB).toBe(12.5);
    expect(result.testCasesPassed).toBe(0);
  });

  it('should return ACCEPTED with biggest runtime and memory usage', async () => {
    const testCases = [
      makeTestCase('1\n', '1\n'),
      makeTestCase('2\n', '2\n'),
    ];

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
    expect(result.status).toBe(StatusEnum.ACCEPTED);
    expect(result.executionTime).toBe(10);
    expect(result.stdout).toBe('2\n');
    expect(result.error).toBeNull();
    expect(result.memoryUsageMB).toBe(9.25);
    expect(result.testCasesPassed).toBe(2);
  });
});
