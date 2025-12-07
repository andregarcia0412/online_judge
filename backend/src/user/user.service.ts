import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ReturnUserDto } from './dto/return-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.userRepository.findOneBy({ email: createUserDto.email })) {
      throw new ConflictException('User already exists');
    }

    const hash = await bcrypt.hash(createUserDto.password, 10);

    createUserDto.password = hash;
    const newUser = await this.userRepository.save(createUserDto);

    return new ReturnUserDto(
      newUser.id_user,
      newUser.email,
      newUser.username,
      newUser.points,
      newUser.total_submissions,
      newUser.total_resolved,
      newUser.streak,
      newUser.creation_date,
    );
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOneById(id_user: number) {
    const user = await this.userRepository.findOneBy({ id_user });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new ReturnUserDto(
      user.id_user,
      user.email,
      user.username,
      user.points,
      user.total_submissions,
      user.total_resolved,
      user.streak,
      user.creation_date,
    );
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new ReturnUserDto(
      user.id_user,
      user.email,
      user.username,
      user.points,
      user.total_submissions,
      user.total_resolved,
      user.streak,
      user.creation_date,
    );
  }

  update(id_user: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id_user, updateUserDto);
  }

  remove(id_user: number) {
    return this.userRepository.delete(id_user);
  }
}
