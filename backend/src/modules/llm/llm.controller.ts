import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/common/jwt-auth.guard';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { AnalyzeResponseDto } from './dto/analyze-response.dto';
import { AskRequestDto } from './dto/ask-request.dto';
import { AskResponseDto } from './dto/ask-response.dto';
import { LlmService } from './llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

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
