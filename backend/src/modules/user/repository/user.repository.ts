import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRepositoryPort } from '../interface/user.repository.port';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(
    email: string,
    manager?: EntityManager,
  ): Promise<User | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ email });
  }
  async findOneByUsername(
    username: string,
    manager?: EntityManager,
  ): Promise<User | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ username });
  }
  async findOneById(id: string, manager?: EntityManager): Promise<User | null> {
    const repository = this.getRepository(manager);
    return await repository.findOneBy({ id });
  }
  async save(user: Partial<User>, manager?: EntityManager): Promise<User> {
    const repository = this.getRepository(manager);
    return await repository.save(user);
  }
  async saveExistingEntity(user: User, manager?: EntityManager): Promise<User> {
    const repository = this.getRepository(manager);
    return await repository.save(user);
  }
  async findAll(manager?: EntityManager): Promise<User[]> {
    const repository = this.getRepository(manager);
    return await repository.find();
  }
  async updateById(
    id: string,
    updateUser: Partial<User>,
    manager?: EntityManager,
  ): Promise<User | null> {
    const repository = this.getRepository(manager);
    const user = await repository.findOneBy({ id });

    if (!user) {
      return null;
    }

    const merged = repository.merge(user, updateUser);

    return await repository.save(merged);
  }
  async delete(id: string, manager?: EntityManager): Promise<void> {
    const repository = this.getRepository(manager);
    await repository.delete(id);
  }

  private getRepository(manager?: EntityManager): Repository<User> {
    return manager ? manager.getRepository(User) : this.userRepository;
  }
}
