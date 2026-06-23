import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptProvider } from 'src/shared/provider/hash/bcrypt.provider';
import { HashProviderPort } from 'src/shared/provider/hash/hash.provider.port';
import { SubmissionModule } from '../submission/submission.module';
import { User } from './entities/user.entity';
import { UserRepositoryPort } from './interface/user.repository.port';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserUseCase } from './use-case/create.use-case';
import { FindAllUserUseCase } from './use-case/find-all.use-case';
import { FindOneUserByIdUseCase } from './use-case/find-one-by-id.use-case';
import { UpdateUserStreakUseCase } from './use-case/update-streak.use-case';
import { FindOneByEmailUseCase } from './use-case/find-one-by-email.use-case';
import { FindAllSubmissionsUseCase } from './use-case/find-all-submissions.use-case';
import { UpdateUserUseCase } from './use-case/update.use-case';
import { UpdateUserStreakOnSubmissionUseCase } from './use-case/update-streak-on-submission.use-case';
import { DeleteUserUseCase } from './use-case/delete.use-case';
import { UserServicePort } from './interface/user.service.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => SubmissionModule),
  ],
  controllers: [UserController],
  providers: [
    { provide: UserServicePort, useClass: UserService },
    { provide: UserRepositoryPort, useClass: UserRepository },
    { provide: HashProviderPort, useClass: BcryptProvider },
    CreateUserUseCase,
    FindAllUserUseCase,
    FindOneUserByIdUseCase,
    UpdateUserStreakUseCase,
    FindOneByEmailUseCase,
    FindAllSubmissionsUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    UpdateUserStreakOnSubmissionUseCase,
  ],
  exports: [UserServicePort, UserRepositoryPort],
})
export class UserModule {}
