import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepositoryPort } from '../interface/user.repository.port';

@Injectable()
export class FindOneByEmailUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
