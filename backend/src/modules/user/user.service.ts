import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReturnSubmissionDto } from 'src/modules/submission/dto/return-submission.dto';
import { Submission } from 'src/modules/submission/entities/submission.entity';
import { HashProviderPort } from 'src/shared/provider/hash.provider.port';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { SubmissionRepositoryPort } from '../submission/interface/submission.repository.port';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepositoryPort } from './interface/user.repository.port';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(SubmissionRepositoryPort)
    private readonly submissionRepository: SubmissionRepositoryPort,
    @Inject(HashProviderPort)
    private readonly hashProvider: HashProviderPort,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    if (await this.userRepository.findOneByEmail(createUserDto.email)) {
      throw new ConflictException('This email is already in use');
    }

    if (await this.userRepository.findOneByUsername(createUserDto.username)) {
      throw new ConflictException('This username is already in use');
    }

    const hash = await this.hashProvider.generateHash(createUserDto.password);

    createUserDto.password = hash;
    const newUser = await this.userRepository.save(createUserDto);

    return ReturnUserDto.fromEntity(newUser);
  }

  async findAll(): Promise<ReturnUserDto[]> {
    return (await this.userRepository.findAll()).map((user: User) =>
      ReturnUserDto.fromEntity(user),
    );
  }

  async findOneById(id: string): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.updateUserStreak(user);
    return ReturnUserDto.fromEntity(user);
  }

  async findOneByEmail(email: string): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ReturnUserDto.fromEntity(user);
  }

  async findAllSubmissionsById(id: string): Promise<ReturnSubmissionDto[]> {
    return (await this.submissionRepository.findAllByUserId(id)).map(
      (submission: Submission) => ReturnSubmissionDto.fromEntity(submission),
    );
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.updateById(id, updateUserDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async updateUserStreak(user: User) {
    const lastUserSubmission =
      await this.submissionRepository.findLastUserSubmission(user.id);
    const oldUserStreak = user.streak;

    if (!lastUserSubmission) {
      user.streak = 0;
    } else {
      const lastDate = new Date(lastUserSubmission.submission_date);
      const today = new Date();

      lastDate.setUTCHours(0, 0, 0, 0);
      today.setUTCHours(0, 0, 0, 0);

      const diffDays = this.getDiffDays(today, lastDate);

      if (diffDays > 1) {
        user.streak = 0;
      }
    }
    const newUserStreak = user.streak;
    if (oldUserStreak !== newUserStreak) {
      await this.userRepository.saveExistingEntity(user);
    }
  }

  async updateUserStreakOnSubmission(user: User, manager?: EntityManager) {
    const lastUserSubmission =
      await this.submissionRepository.findLastUserSubmission(user.id, manager);

    if (!lastUserSubmission) {
      user.streak = 1;
    } else {
      const lastDate = new Date(lastUserSubmission.submission_date);
      const today = new Date();

      lastDate.setUTCHours(0, 0, 0, 0);
      today.setUTCHours(0, 0, 0, 0);

      const diffDays = this.getDiffDays(today, lastDate);

      if (diffDays === 0) return;

      if (diffDays === 1) {
        user.streak = Number(user.streak) + 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    }
  }
  private getDiffDays(today: Date, lastDate: Date): number {
    return Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }
}
