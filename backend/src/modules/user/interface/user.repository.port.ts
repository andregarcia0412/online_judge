import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  findOneByEmail(email: string, manager?: EntityManager): Promise<User | null>;
  findOneByUsername(
    username: string,
    manager?: EntityManager,
  ): Promise<User | null>;
  findOneById(id: string, manager?: EntityManager): Promise<User | null>;
  save(createUserDto: CreateUserDto, manager?: EntityManager): Promise<User>;
  saveExistingEntity(user: User, manager?: EntityManager): Promise<User>;
  findAll(manager?: EntityManager): Promise<User[]>;
  updateById(
    id: string,
    updateUserDto: UpdateUserDto,
    manager?: EntityManager,
  ): Promise<UpdateResult>;
  delete(id: string, manager?: EntityManager): Promise<DeleteResult>;
}

export const UserRepositoryPort = Symbol('UserRepositoryPort');
