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

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: HashProviderPort, useClass: BcryptProvider },
  ],
})
export class AuthModule {}
