import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../interface/user.repository.port';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string) {
    return this.userRepository.delete(id);
  }
}
