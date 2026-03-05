import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { DeleteResult, UpdateResult } from 'typeorm/browser';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { ReturnSubmissionDto } from 'src/submission/dto/return-submission.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    if (await this.userRepository.findOneBy({ email: createUserDto.email })) {
      throw new ConflictException('This email is already in use');
    }

    if (
      await this.userRepository.findOneBy({ username: createUserDto.username })
    ) {
      throw new ConflictException('This username is already in use');
    }

    const hash = await bcrypt.hash(createUserDto.password, 10);

    createUserDto.password = hash;
    const newUser = await this.userRepository.save(createUserDto);

    return ReturnUserDto.fromEntity(newUser);
  }

  async findAll(): Promise<ReturnUserDto[]> {
    return (await this.userRepository.find()).map((user: User) =>
      ReturnUserDto.fromEntity(user),
    );
  }

  async findOneById(id: string): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ReturnUserDto.fromEntity(user);
  }

  async findOneByEmail(email: string): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ReturnUserDto.fromEntity(user);
  }

  async findAllSubmissionsById(id: string): Promise<ReturnSubmissionDto[]> {
    return (await this.submissionRepository.findBy({ id_user: id })).map(
      (submission: Submission) => ReturnSubmissionDto.fromEntity(submission),
    );
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
