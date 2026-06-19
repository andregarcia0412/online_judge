import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { UserModule } from 'src/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './common/jwt.strategy';
import { HashProviderPort } from 'src/shared/provider/hash/hash.provider.port';
import { BcryptProvider } from 'src/shared/provider/hash/bcrypt.provider';
import { AuthServicePort } from './interface/auth.service.port';
import { JwtProviderPort } from './provider/jwt.provider.port';
import { JwtProvider } from './provider/jwt.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    { provide: AuthServicePort, useClass: AuthService },
    { provide: JwtProviderPort, useClass: JwtProvider },
    { provide: HashProviderPort, useClass: BcryptProvider },
    JwtStrategy,
  ],
})
export class AuthModule {}
