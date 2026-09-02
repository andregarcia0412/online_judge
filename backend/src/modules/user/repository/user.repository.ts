import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRepositoryPort } from '../interface/user.repository.port';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }
  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username });
  }
  async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }
  async save(user: Partial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }
  async saveExistingEntity(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async updateById(
    id: string,
    updateUser: Partial<User>,
  ): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return null;
    }

    const merged = this.userRepository.merge(user, updateUser);

    return await this.userRepository.save(merged);
  }
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  private get userRepository(): Repository<User> {
    return this.txHost.tx.getRepository(User);
  }
}
