import { Injectable } from '@nestjs/common';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AskRequestDto } from './dto/ask-request.dto';
import { ModelResponseDto } from './dto/model-response.dto';
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
  ): Promise<ModelResponseDto> {
    const { data } = await lastValueFrom(
      this.httpService.post<ModelResponseDto>(
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

  async ask(askRequestDto: AskRequestDto): Promise<ModelResponseDto> {
    const { data } = await lastValueFrom(
      this.httpService.post<ModelResponseDto>(
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
