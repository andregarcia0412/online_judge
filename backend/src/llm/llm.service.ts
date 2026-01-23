import { Injectable } from '@nestjs/common';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';

import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AnalyzeResponseDto } from './dto/analyze-response.dto';
import { AskRequestDto } from './dto/ask-request.dto';
import { AskResponseDto } from './dto/ask-response.dto';

@Injectable()
export class LlmService {
  private apiUrl: string | undefined;
  private apiSecret: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get<string>('LLM_API_URL');
    this.apiSecret = this.configService.get<string>('X-API-PASSWORD');
  }

  async analyze(
    analyzeRequestDto: AnalyzeRequestDto,
  ): Promise<AnalyzeResponseDto> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.apiUrl}/llm/analyze`,
          {
            code: analyzeRequestDto.code,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: this.apiSecret,
            },
          },
        ),
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  } //senha pra api do ollama?

  async ask(askRequestDto: AskRequestDto): Promise<AskResponseDto> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.apiUrl}/llm/analyze`,
          {
            language: askRequestDto.language,
            code: askRequestDto.code,
            question: askRequestDto.question,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: this.apiSecret,
            },
          },
        ),
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
