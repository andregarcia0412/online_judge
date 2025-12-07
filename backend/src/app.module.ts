import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubmissionModule } from './submission/submission.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type:'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),

      autoLoadEntities: true,
      synchronize: true,
    }),
    inject: [ConfigService]
  }),
  SubmissionModule,
  UserModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
