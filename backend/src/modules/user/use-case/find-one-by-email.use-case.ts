import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepositoryPort } from '../interface/user.repository.port';

@Injectable()
export class FindOneByEmailUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneByEmail(email);

    return user;
  }
}
