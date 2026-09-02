import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  findOneByEmail(email: string): Promise<User | null>;
  findOneByUsername(username: string): Promise<User | null>;
  findOneById(id: string): Promise<User | null>;
  save(user: Partial<User>): Promise<User>;
  saveExistingEntity(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  updateById(id: string, updateUser: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export const UserRepositoryPort = Symbol('UserRepositoryPort');
