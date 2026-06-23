import { Inject, Injectable } from '@nestjs/common';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserServicePort } from './interface/user.service.port';
import { CreateUserUseCase } from './use-case/create.use-case';
import { DeleteUserUseCase } from './use-case/delete.use-case';
import { FindAllSubmissionsUseCase } from './use-case/find-all-submissions.use-case';
import { FindAllUserUseCase } from './use-case/find-all.use-case';
import { FindOneByEmailUseCase } from './use-case/find-one-by-email.use-case';
import { FindOneUserByIdUseCase } from './use-case/find-one-by-id.use-case';
import { UpdateUserStreakOnSubmissionUseCase } from './use-case/update-streak-on-submission.use-case';
import { UpdateUserStreakUseCase } from './use-case/update-streak.use-case';
import { UpdateUserUseCase } from './use-case/update.use-case';

@Injectable()
export class UserService implements UserServicePort {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(FindAllUserUseCase)
    private readonly findAllUseCase: FindAllUserUseCase,
    @Inject(FindOneUserByIdUseCase)
    private readonly findOneUserByIdUseCase: FindOneUserByIdUseCase,
    @Inject(UpdateUserStreakUseCase)
    private readonly updateUserStreakUseCase: UpdateUserStreakUseCase,
    @Inject(FindOneByEmailUseCase)
    private readonly findOneByEmailUseCase: FindOneByEmailUseCase,
    @Inject(FindAllSubmissionsUseCase)
    private readonly findAllSubmissionsUseCase: FindAllSubmissionsUseCase,
    @Inject(UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(DeleteUserUseCase)
    private readonly deleteUserUseCase: DeleteUserUseCase,
    @Inject(UpdateUserStreakOnSubmissionUseCase)
    private readonly updateUserStreakOnSubmissionUseCase: UpdateUserStreakOnSubmissionUseCase,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return ReturnUserDto.fromEntity(
      await this.createUserUseCase.execute(createUserDto),
    );
  }

  async findAll(): Promise<ReturnUserDto[]> {
    return (await this.findAllUseCase.execute()).map(ReturnUserDto.fromEntity);
  }

  async findOneById(id: string): Promise<ReturnUserDto> {
    const user = await this.findOneUserByIdUseCase.execute(id);
    await this.updateUserStreakUseCase.execute(user);

    return ReturnUserDto.fromEntity(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.findOneByEmailUseCase.execute(email);
  }

  async findAllSubmissionsById(id: string): Promise<ReturnSubmissionDto[]> {
    return (await this.findAllSubmissionsUseCase.execute(id)).map(
      ReturnSubmissionDto.fromEntity,
    );
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    return ReturnUserDto.fromEntity(
      await this.updateUserUseCase.execute(id, updateUserDto),
    );
  }

  async remove(id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }

  async updateUserStreak(user: User): Promise<void> {
    await this.updateUserStreakUseCase.execute(user);
  }

  async updateUserStreakOnSubmission(
    user: User,
    manager?: EntityManager,
  ): Promise<void> {
    await this.updateUserStreakOnSubmissionUseCase.execute(user, manager);
  }
}
