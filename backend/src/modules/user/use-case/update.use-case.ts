import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../interface/user.repository.port';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.updateById(id, updateUserDto);
  }
}
