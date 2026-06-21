import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { BcryptProvider } from 'src/shared/provider/hash/bcrypt.provider';
import { HashProviderPort } from 'src/shared/provider/hash/hash.provider.port';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './common/jwt.strategy';
import { AuthServicePort } from './interface/auth.service.port';
import { JwtProvider } from './provider/jwt.provider';
import { JwtProviderPort } from './provider/jwt.provider.port';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    { provide: AuthServicePort, useClass: AuthService },
    { provide: JwtProviderPort, useClass: JwtProvider },
    { provide: HashProviderPort, useClass: BcryptProvider },
    JwtStrategy,
  ],
})
export class AuthModule {}
