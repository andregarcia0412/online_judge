import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  findOneByEmail(email: string): Promise<User | null>;
  findOneByUsername(username: string): Promise<User | null>;
  findOneById(id: string): Promise<User | null>;
  save(createUserDto: CreateUserDto): Promise<User>;
  saveExistingEntity(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  updateById(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult>;
  delete(id: string): Promise<DeleteResult>;
}

export const UserRepositoryPort = Symbol('UserRepositoryPort');
