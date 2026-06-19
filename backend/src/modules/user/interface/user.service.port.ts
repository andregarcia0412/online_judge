import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { ReturnUserDto } from '../dto/return-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { EntityManager } from 'typeorm';

export interface UserServicePort {
  create(createUserDto: CreateUserDto): Promise<ReturnUserDto>;
  findAll(): Promise<ReturnUserDto[]>;
  findOneById(id: string): Promise<ReturnUserDto>;
  findOneByEmail(email: string): Promise<ReturnUserDto>;
  findAllSubmissionsById(id: string): Promise<ReturnSubmissionDto[]>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<ReturnUserDto>;
  remove(id: string): Promise<void>;
  updateUserStreak(user: User): Promise<void>;
  updateUserStreakOnSubmission(
    user: User,
    manager?: EntityManager,
  ): Promise<void>;
}

export const UserServicePort = Symbol('UserServicePort');
