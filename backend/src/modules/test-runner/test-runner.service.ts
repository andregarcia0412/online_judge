import { BadRequestException, Injectable } from '@nestjs/common';
import { CodeRunnerService } from 'src/modules/code-runner/code-runner.service';
import { TestCase } from 'src/modules/test-case/entities/test-case.entity';
import Docker from 'dockerode';
import { TestResult } from './dto/test-result.dto';
import { LANGUAGES } from 'src/modules/code-runner/languages';
import { StatusEnum } from '../submission/enum/submission-status';
import { ExecuteCodeDto } from '../code-runner/dto/execute-code.dto';

@Injectable()
export class TestRunnerService {
  private docker: Docker;
  constructor(private codeRunnerService: CodeRunnerService) {
    this.docker = new Docker();
  }

  async runTests(
    testCases: TestCase[],
    userCode: string,
    selectedLanguage: string,
  ): Promise<TestResult> {
    const language = LANGUAGES[selectedLanguage];
    let biggestUsage = 0;
    let testCasesPassed = 0;
    let biggestRuntime = 0;

    if (!language) {
      throw new BadRequestException('Invalid language name');
    }

    let result: ExecuteCodeDto | null = null;

    await this.codeRunnerService.ensureImageExists(
      language.imageName,
      this.docker,
    );

    if (!testCases || testCases.length === 0) {
      throw new BadRequestException('No test cases found for this problem');
    }

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      result = await this.codeRunnerService.executeCode(
        userCode,
        this.docker,
        language,
        testCase.input,
      );

      if (
        !result ||
        result.timeMs === undefined ||
        result.memoryUsage === undefined
      ) {
        return new TestResult(
          StatusEnum.REJECTED,
          biggestRuntime,
          null,
          'Execution failed',
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
        return new TestResult(
          StatusEnum.REJECTED,
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
      StatusEnum.ACCEPTED,
      Math.trunc(biggestRuntime),
      result.output,
      null,
      biggestUsage,
      testCasesPassed,
    );
  }
}
