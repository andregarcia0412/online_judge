import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenStrategy } from './refresh-token.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entity/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
