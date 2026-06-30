import { AnalyzeRequestDto } from '../dto/analyze-request.dto';
import { AskRequestDto } from '../dto/ask-request.dto';
import { ModelResponseDto } from '../dto/model-response.dto';

export interface LlmServicePort {
  analyze(analyzeRequestDto: AnalyzeRequestDto): Promise<ModelResponseDto>;
  ask(askRequestDto: AskRequestDto): Promise<ModelResponseDto>;
}

export const LlmServicePort = Symbol('LlmServicePort');
