import { Module } from '@nestjs/common';
import { SubmissionModule } from './modules/submission/submission.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProblemModule } from './modules/problem/problem.module';
import { TestCaseModule } from './modules/test-case/test-case.module';
import { AuthModule } from './modules/auth/auth.module';
import { LlmModule } from './modules/llm/llm.module';
import { SystemModule } from './modules/system/system.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    SubmissionModule,
    UserModule,
    ProblemModule,
    TestCaseModule,
    AuthModule,
    LlmModule,
    SystemModule,
  ],
})
export class AppModule {}
