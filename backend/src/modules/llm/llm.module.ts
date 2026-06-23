import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { LlmServicePort } from './interface/llm.service.port';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';

@Module({
  imports: [HttpModule, ConfigModule, AuthModule],
  controllers: [LlmController],
  providers: [{ provide: LlmServicePort, useClass: LlmService }],
})
export class LlmModule {}
