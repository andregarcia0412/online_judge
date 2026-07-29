import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { LlmModule } from './modules/llm/llm.module';
import { ProblemModule } from './modules/problem/problem.module';
import { SeedsModule } from './modules/seeds/seeds.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { SystemModule } from './modules/system/system.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './shared/database/database.module';
import { CacheModule } from './shared/provider/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3000),
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        ALLOWED_ORIGINS: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        THROTTLE_TTL: Joi.number().min(10000).default(60000),
        THROTTLE_LIMIT: Joi.number().min(10).default(100),

        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().port().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().port().required(),

        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
        PASSWORD_RESET_SECRET: Joi.string().required(),
        MAX_RESET_PASSWORD_TRIES: Joi.number().positive().default(10),

        RESEND_API_KEY: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),

        MAIL_FROM: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),

        BCRYPT_SALT: Joi.number().integer().min(4).max(31).default(10),

        LLM_API_URL: Joi.string().required(),
        INTERNAL_API_KEY: Joi.string().required(),

        RUN_SEEDS: Joi.boolean().default(true),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.getOrThrow<number>('THROTTLE_TTL'),
            limit: configService.getOrThrow<number>('THROTTLE_LIMIT'),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    CacheModule,
    SubmissionModule,
    UserModule,
    ProblemModule,
    AuthModule,
    LlmModule,
    SystemModule,
    SeedsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
