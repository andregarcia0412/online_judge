import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { LlmModule } from './modules/llm/llm.module';
import { ProblemModule } from './modules/problem/problem.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { SystemModule } from './modules/system/system.module';
import { UserModule } from './modules/user/user.module';

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

        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().port().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),

        BCRYPT_SALT: Joi.number().integer().min(4).max(31).default(10),

        LLM_API_URL: Joi.string().required(),
        INTERNAL_API_KEY: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),

        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [TypeOrmModule],
          adapter: new TransactionalAdapterTypeOrm({
            dataSourceToken: DataSource,
          }),
        }),
      ],
    }),
    SubmissionModule,
    UserModule,
    ProblemModule,
    AuthModule,
    LlmModule,
    SystemModule,
  ],
})
export class AppModule {}
