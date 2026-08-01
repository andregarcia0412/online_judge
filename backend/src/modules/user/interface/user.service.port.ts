import { CreateUserDto } from '../dto/create-user.dto';
import { ReturnAvatarDto } from '../dto/return-avatar.dto';
import { ReturnUserDto } from '../dto/return-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface UserServicePort {
  create(createUserDto: CreateUserDto): Promise<ReturnUserDto>;
  findAll(): Promise<ReturnUserDto[]>;
  findOneById(id: string): Promise<ReturnUserDto>;
  findUserEntityById(id: string): Promise<User>;
  findOneByEmail(email: string): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<ReturnUserDto>;
  remove(id: string): Promise<void>;
  updateUserStreak(user: User): Promise<void>;
  updateUserStreakOnSubmission(user: User): void;
  createUserAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<ReturnAvatarDto>;
  getUserAvatar(id: string): Promise<ReturnAvatarDto>;
}

export const UserServicePort = Symbol('UserServicePort');
