import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LlmService } from './llm.service';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { AskRequestDto } from './dto/ask-request.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AnalyzeResponseDto } from './dto/analyze-response.dto';
import { AskResponseDto } from './dto/ask-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('/analyze')
  @ApiCreatedResponse({ type: AnalyzeResponseDto })
  @UseGuards(JwtAuthGuard)
  analyze(@Body() analyzeRequestDto: AnalyzeRequestDto) {
    return this.llmService.analyze(analyzeRequestDto);
  }

  @Post('/ask')
  @ApiCreatedResponse({ type: AskResponseDto })
  @UseGuards(JwtAuthGuard)
  ask(@Body() askRequestDto: AskRequestDto) {
    return this.llmService.ask(askRequestDto);
  }
}
