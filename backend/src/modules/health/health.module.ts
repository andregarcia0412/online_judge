import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from 'src/shared/provider/cache/cache.module';
import { RedisHealthIndicator } from './indicator/redis-health.indicator';

@Module({
  imports: [TerminusModule, HttpModule, CacheModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator],
})
export class HealthModule {}
