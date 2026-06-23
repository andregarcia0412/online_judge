import { Injectable } from '@nestjs/common';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';

import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AnalyzeResponseDto } from './dto/analyze-response.dto';
import { AskRequestDto } from './dto/ask-request.dto';
import { AskResponseDto } from './dto/ask-response.dto';
import { LlmServicePort } from './interface/llm.service.port';

@Injectable()
export class LlmService implements LlmServicePort {
  private apiUrl: string | undefined;
  private apiSecret: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get<string>('LLM_API_URL');
    this.apiSecret = this.configService.get<string>('X_API_PASSWORD');
  }

  async analyze(
    analyzeRequestDto: AnalyzeRequestDto,
  ): Promise<AnalyzeResponseDto> {
    const response = await lastValueFrom(
      this.httpService.post(
        `${this.apiUrl}/llm/analyze`,
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
    return response.data;
  }

  async ask(askRequestDto: AskRequestDto): Promise<AskResponseDto> {
    const response = await lastValueFrom(
      this.httpService.post(
        `${this.apiUrl}/llm/ask`,
        {
          language: askRequestDto.language,
          code: askRequestDto.code,
          question: askRequestDto.question,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-PASSWORD': this.apiSecret,
          },
        },
      ),
    );

    return response.data;
  }
}
