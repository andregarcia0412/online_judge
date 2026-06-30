import { AnalyzeRequestDto } from '../dto/analyze-request.dto';
import { AskRequestDto } from '../dto/ask-request.dto';
import { LlmResponseDto } from '../dto/llm-response.dto';

export interface LlmProviderPort {
  analyze(analyzeRequestDto: AnalyzeRequestDto): Promise<LlmResponseDto>;
  ask(askRequestDto: AskRequestDto): Promise<LlmResponseDto>;
}

export const LlmProviderPort = Symbol('LlmProviderPort');
