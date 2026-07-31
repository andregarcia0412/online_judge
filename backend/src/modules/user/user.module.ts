import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptProvider } from 'src/shared/provider/hash/bcrypt.provider';
import { HashProviderPort } from 'src/shared/provider/hash/hash.provider.port';
import { User } from './entities/user.entity';
import { UserRepositoryPort } from './interface/user.repository.port';
import { UserServicePort } from './interface/user.service.port';
import { UserRepository } from './repository/user.repository';
import { CreateUserUseCase } from './use-case/create.use-case';
import { DeleteUserUseCase } from './use-case/delete.use-case';
import { FindAllUserUseCase } from './use-case/find-all.use-case';
import { FindOneByEmailUseCase } from './use-case/find-one-by-email.use-case';
import { FindOneUserByIdUseCase } from './use-case/find-one-by-id.use-case';
import { UpdateUserStreakOnSubmissionUseCase } from './use-case/update-streak-on-submission.use-case';
import { UpdateUserStreakUseCase } from './use-case/update-streak.use-case';
import { UpdateUserUseCase } from './use-case/update.use-case';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StorageProviderPort } from 'src/shared/provider/storage/storage.provider.port';
import { S3Provider } from 'src/shared/provider/storage/s3.provider';
import { GetAvatarUseCase } from './use-case/get-avatar.use-case';
import { PutAvatarUseCase } from './use-case/put-avatar.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    { provide: UserServicePort, useClass: UserService },
    { provide: UserRepositoryPort, useClass: UserRepository },
    { provide: HashProviderPort, useClass: BcryptProvider },
    { provide: StorageProviderPort, useClass: S3Provider },
    CreateUserUseCase,
    FindAllUserUseCase,
    FindOneUserByIdUseCase,
    UpdateUserStreakUseCase,
    FindOneByEmailUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    UpdateUserStreakOnSubmissionUseCase,
    GetAvatarUseCase,
    PutAvatarUseCase,
  ],
  exports: [UserServicePort],
})
export class UserModule {}
