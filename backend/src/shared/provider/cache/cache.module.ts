import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { CacheProviderPort } from './cache.provider.port';
import { REDIS } from './cache.tokens';
import { RedisProvider } from './redis.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS,
      useFactory: (configService: ConfigService) =>
        new Redis({
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
          maxRetriesPerRequest: 3,
        }),
      inject: [ConfigService],
    },
    { provide: CacheProviderPort, useClass: RedisProvider },
  ],
  exports: [REDIS, CacheProviderPort],
})
export class CacheModule {}
