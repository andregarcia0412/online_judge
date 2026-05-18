import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptProvider } from 'src/shared/provider/bcrypt.provider';
import { HashProviderPort } from 'src/shared/provider/hash.provider.port';
import { SubmissionModule } from '../submission/submission.module';
import { User } from './entities/user.entity';
import { UserRepositoryPort } from './interface/user.repository.port';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => SubmissionModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: UserRepositoryPort, useClass: UserRepository },
    { provide: HashProviderPort, useClass: BcryptProvider },
  ],
  exports: [UserService, UserRepositoryPort],
})
export class UserModule {}
