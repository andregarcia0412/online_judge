import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  exports: [UserService, UserRepositoryPort],
})
export class UserModule {}
