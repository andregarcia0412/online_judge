import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TestCase } from 'src/modules/problem/entities/test-case.entity';
import { CodeRunnerProviderPort } from 'src/shared/provider/code-runner/code-runner.provider.port';
import { ExecuteCodeDto } from '../../shared/provider/code-runner/dto/execute-code.dto';
import { SubmissionStatusEnum } from '../../shared/enum/submission-status';
import { TestResult } from './dto/test-result.dto';
import { TestRunnerServicePort } from './interface/test-runner.service.port';

@Injectable()
export class TestRunnerService implements TestRunnerServicePort {
  constructor(
    @Inject(CodeRunnerProviderPort)
    private readonly codeRunnerProviderPort: CodeRunnerProviderPort,
  ) {}

  async runTests(
    testCases: TestCase[],
    userCode: string,
    selectedLanguage: string,
  ): Promise<TestResult> {
    const language = this.codeRunnerProviderPort
      .getAllowedLanguages()
      .find((value) => value == selectedLanguage);
    let biggestUsage = 0;
    let testCasesPassed = 0;
    let biggestRuntime = 0;

    if (!language) {
      throw new BadRequestException('Invalid language name');
    }

    let result: ExecuteCodeDto | null = null;

    if (!testCases || testCases.length === 0) {
      throw new BadRequestException('No test cases found for this problem');
    }

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      result = await this.codeRunnerProviderPort.executeCode(
        userCode,
        language,
        testCase.input,
      );

      if (
        !result ||
        result.timeMs === undefined ||
        result.memoryUsage === undefined
      ) {
        return new TestResult(
          SubmissionStatusEnum.SUBMISSION_ERROR,
          biggestRuntime,
          null,
          'Execution failed',
          0,
          testCasesPassed,
        );
      }

      if (
        result.status === SubmissionStatusEnum.COMPILATION_ERROR ||
        result.status === SubmissionStatusEnum.TIME_LIMIT_EXCEEDED ||
        result.errorOcurred
      ) {
        return new TestResult(
          result.status ?? SubmissionStatusEnum.RUNTIME_ERROR,
          biggestRuntime,
          null,
          result.errOutput,
          0,
          testCasesPassed,
        );
      }

      if (result.memoryUsage > biggestUsage) {
        biggestUsage = result.memoryUsage;
      }

      if (result.timeMs > biggestRuntime) {
        biggestRuntime = result.timeMs;
      }

      if (testCase.output != result.output) {
        if (this.normalize(result.output) === this.normalize(testCase.output)) {
          return new TestResult(
            SubmissionStatusEnum.PRESENTATION_ERROR,
            Math.trunc(biggestRuntime),
            result.output,
            null,
            biggestUsage,
            testCasesPassed,
          );
        }

        return new TestResult(
          SubmissionStatusEnum.WRONG_ANSWER,
          Math.trunc(biggestRuntime),
          result.output,
          result.errorOcurred ? result.errOutput : null,
          biggestUsage,
          testCasesPassed,
        );
      }

      testCasesPassed++;
    }

    if (!result) {
      throw new Error('Unexpected execution state');
    }

    return new TestResult(
      SubmissionStatusEnum.ACCEPTED,
      Math.trunc(biggestRuntime),
      result.output,
      null,
      biggestUsage,
      testCasesPassed,
    );
  }

  private normalize(s: string): string {
    return s
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .join('\n')
      .replace(/\n+$/g, '');
  }
}
