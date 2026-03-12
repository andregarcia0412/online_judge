import { BadRequestException, Injectable } from '@nestjs/common';
import { CodeRunnerService } from 'src/modules/code-runner/code-runner.service';
import { TestCase } from 'src/modules/test-case/entities/test-case.entity';
import Docker from 'dockerode';
import { TestResult } from './dto/test-result.dto';
import { LANGUAGES } from 'src/modules/code-runner/languages';
import { StatusEnum } from '../submission/enum/submission-status';

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

    if (!language) {
      throw new BadRequestException('Invalid language name');
    }

    let result: any;

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

      if (!result || result.timeMs === undefined) {
        return new TestResult(StatusEnum.REJECTED, 0, null, 'Execution failed');
      }

      if (testCase.output != result.output) {
        return new TestResult(
          StatusEnum.REJECTED,
          Math.trunc(result.timeMs),
          result.output,
          result.errorOcurred ? result.errOutput : null,
        );
      }
    }

    return new TestResult(
      StatusEnum.ACCEPTED,
      Math.trunc(result.timeMs),
      result.output,
      null,
    );
  }
}
