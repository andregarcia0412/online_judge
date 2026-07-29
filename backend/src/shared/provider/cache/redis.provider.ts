import { Inject, Injectable } from '@nestjs/common';
import { CacheProviderPort } from './cache.provider.port';
import { REDIS } from './cache.tokens';
import { Redis } from 'ioredis';

@Injectable()
export class RedisProvider implements CacheProviderPort {
  constructor(
    @Inject(REDIS)
    private readonly cacheManager: Redis,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cacheManager.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);

    if (ttl) {
      await this.cacheManager.set(key, serialized, 'EX', ttl);
    } else {
      await this.cacheManager.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clear(): Promise<void> {
    await this.cacheManager.flushdb();
  }
}
