import { AnalyzeRequestDto } from '../dto/analyze-request.dto';
import { AnalyzeResponseDto } from '../dto/model-response.dto';
import { AskRequestDto } from '../dto/ask-request.dto';
import { AskResponseDto } from '../dto/ask-response.dto';

export interface LlmServicePort {
  analyze(analyzeRequestDto: AnalyzeRequestDto): Promise<AnalyzeResponseDto>;
  ask(askRequestDto: AskRequestDto): Promise<AskResponseDto>;
}

export const LlmServicePort = Symbol('LlmServicePort');
