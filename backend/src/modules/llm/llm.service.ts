import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { AskRequestDto } from './dto/ask-request.dto';
import { LlmResponseDto } from './dto/llm-response.dto';
import { LlmServicePort } from './interface/llm.service.port';
import { LlmProviderPort } from './provider/llm.provider.port';

@Injectable()
export class LlmService implements LlmServicePort {
  private readonly logger = new Logger(LlmService.name);
  constructor(
    @Inject(LlmProviderPort)
    private readonly llmProvider: LlmProviderPort,
  ) {}

  async analyze(analyzeRequestDto: AnalyzeRequestDto): Promise<LlmResponseDto> {
    try {
      return await this.llmProvider.analyze(analyzeRequestDto);
    } catch (e) {
      this.logger.error(
        `AI service error: ${e instanceof Error ? e.message : 'Unknown error'}`,
      );
      throw new ServiceUnavailableException('AI service is unavailable');
    }
  }

  async ask(askRequestDto: AskRequestDto): Promise<LlmResponseDto> {
    try {
      return await this.llmProvider.ask(askRequestDto);
    } catch (e) {
      this.logger.error(
        `AI service error: ${e instanceof Error ? e.message : 'Unknown error'}`,
      );
      throw new ServiceUnavailableException('AI service is unavailable');
    }
  }
}
