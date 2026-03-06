import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CodeRunnerService } from '../code-runner.service';
import { LANGUAGES } from '../languages';
import Docker from 'dockerode';

@Injectable()
export class LanguageImageBootstrapService implements OnModuleInit {
  constructor(private readonly codeRunnerService: CodeRunnerService) {}

  private readonly logger = new Logger(LanguageImageBootstrapService.name);

  onModuleInit() {
    Object.entries(LANGUAGES).forEach(async ([key, lang]) => {
      const docker = new Docker();
      await this.codeRunnerService.downloadImage(lang.imageName, docker);
    });
  }
}
