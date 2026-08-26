import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { LivenessResponseDto } from './dto/liveness-response.dto';
import { RedisHealthIndicator } from './indicator/redis-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get('ready')
  @HealthCheck({ noCache: true, swaggerDocumentation: true })
  ready() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 1500 }),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.redis.isHealthy('redis'),
    ]);
  }

  @Get('live')
  @ApiOkResponse({ type: LivenessResponseDto })
  live(): LivenessResponseDto {
    const uptime = process.uptime();

    return new LivenessResponseDto(
      'ok',
      uptime,
      new Date(Date.now() - uptime * 1000).toISOString(),
    );
  }
}
