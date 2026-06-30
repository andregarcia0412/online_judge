import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/common/jwt-auth.guard';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { AskRequestDto } from './dto/ask-request.dto';
import { ModelResponseDto } from './dto/model-response.dto';
import { LlmServicePort } from './interface/llm.service.port';

@Controller('llm')
export class LlmController {
  constructor(
    @Inject(LlmServicePort)
    private readonly llmService: LlmServicePort,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/analyze')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ModelResponseDto })
  @UseGuards(JwtAuthGuard)
  analyze(@Body() analyzeRequestDto: AnalyzeRequestDto) {
    return this.llmService.analyze(analyzeRequestDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/ask')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ModelResponseDto })
  @UseGuards(JwtAuthGuard)
  ask(@Body() askRequestDto: AskRequestDto) {
    return this.llmService.ask(askRequestDto);
  }
}
