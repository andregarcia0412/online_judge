import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, ConfigModule, AuthModule],
  controllers: [LlmController],
  providers: [LlmService],
})
export class LlmModule {}
