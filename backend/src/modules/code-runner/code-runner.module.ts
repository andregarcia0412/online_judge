import { Module } from '@nestjs/common';
import { CodeRunnerService } from './code-runner.service';
import { LanguageImageBootstrapService } from './language-images-bootstrap/language-images-bootstrap.service';

@Module({
  providers: [CodeRunnerService, LanguageImageBootstrapService],
  exports: [CodeRunnerService],
})
export class CodeRunnerModule {}
