import { Injectable } from '@nestjs/common';
import { LlmProviderPort } from './llm.provider.port';
import { AnalyzeRequestDto } from '../dto/analyze-request.dto';
import { AskRequestDto } from '../dto/ask-request.dto';
import { LlmResponseDto } from '../dto/llm-response.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LlmProvider implements LlmProviderPort {
  private apiUrl: string | undefined;
  private apiSecret: string | undefined;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('LLM_API_URL');
    this.apiSecret = this.configService.get<string>('X_API_PASSWORD');
  }

  async analyze(analyzeRequestDto: AnalyzeRequestDto): Promise<LlmResponseDto> {
    const { data } = await lastValueFrom(
      this.httpService.post<LlmResponseDto>(
        `${this.apiUrl}/model/evaluation`,
        {
          code: analyzeRequestDto.code,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-PASSWORD': this.apiSecret,
          },
        },
      ),
    );
    return data;
  }

  async ask(askRequestDto: AskRequestDto): Promise<LlmResponseDto> {
    const { data } = await lastValueFrom(
      this.httpService.post<LlmResponseDto>(
        `${this.apiUrl}/model/chat`,
        {
          language: askRequestDto.language,
          code: askRequestDto.code,
          message: askRequestDto.message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-PASSWORD': this.apiSecret,
          },
        },
      ),
    );

    return data;
  }
}
