import { Inject } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import Redis from 'ioredis';
import { REDIS } from 'src/shared/provider/cache/cache.tokens';

export class RedisHealthIndicator {
  constructor(
    private readonly indicator: HealthIndicatorService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  async isHealthy(key: string) {
    const check = this.indicator.check(key);
    try {
      await Promise.race([
        this.redis.ping(),
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error('timeout')), 800),
        ),
      ]);
      return check.up();
    } catch (e) {
      return check.down({
        message: e instanceof Error ? e.message : 'Unknown Error',
      });
    }
  }
}
