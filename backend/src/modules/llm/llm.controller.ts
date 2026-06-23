import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/common/jwt-auth.guard';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { AnalyzeResponseDto } from './dto/analyze-response.dto';
import { AskRequestDto } from './dto/ask-request.dto';
import { AskResponseDto } from './dto/ask-response.dto';
import { LlmServicePort } from './interface/llm.service.port';

@Controller('llm')
export class LlmController {
  constructor(
    @Inject(LlmServicePort)
    private readonly llmService: LlmServicePort,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/analyze')
  @ApiOkResponse({ type: AnalyzeResponseDto })
  @UseGuards(JwtAuthGuard)
  analyze(@Body() analyzeRequestDto: AnalyzeRequestDto) {
    return this.llmService.analyze(analyzeRequestDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/ask')
  @ApiOkResponse({ type: AskResponseDto })
  @UseGuards(JwtAuthGuard)
  ask(@Body() askRequestDto: AskRequestDto) {
    return this.llmService.ask(askRequestDto);
  }
}
