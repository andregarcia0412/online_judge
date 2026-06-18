import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  findOneByEmail(email: string, manager?: EntityManager): Promise<User | null>;
  findOneByUsername(
    username: string,
    manager?: EntityManager,
  ): Promise<User | null>;
  findOneById(id: string, manager?: EntityManager): Promise<User | null>;
  save(user: Partial<User>, manager?: EntityManager): Promise<User>;
  saveExistingEntity(user: User, manager?: EntityManager): Promise<User>;
  findAll(manager?: EntityManager): Promise<User[]>;
  updateById(
    id: string,
    updateUser: Partial<User>,
    manager?: EntityManager,
  ): Promise<User | null>;
  delete(id: string, manager?: EntityManager): Promise<void>;
}

export const UserRepositoryPort = Symbol('UserRepositoryPort');
