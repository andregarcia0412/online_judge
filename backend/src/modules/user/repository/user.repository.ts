import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../interface/user.repository.port';
import { UpdateResult, DeleteResult, Repository, EntityManager } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
  async save(
    createUserDto: CreateUserDto,
    manager?: EntityManager,
  ): Promise<User> {
    const repository = this.getRepository(manager);
    return await repository.save(createUserDto);
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
    updateUserDto: UpdateUserDto,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    const repository = this.getRepository(manager);
    return await repository.update(id, updateUserDto);
  }
  async delete(id: string, manager?: EntityManager): Promise<DeleteResult> {
    const repository = this.getRepository(manager);
    return await repository.delete(id);
  }

  private getRepository(manager?: EntityManager): Repository<User> {
    return manager ? manager.getRepository(User) : this.userRepository;
  }
}
