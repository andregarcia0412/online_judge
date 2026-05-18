import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { HashProviderPort } from 'src/shared/provider/hash.provider.port';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserRepositoryPort } from '../interface/user.repository.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    @Inject(HashProviderPort)
    private readonly hashProvider: HashProviderPort,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    if (await this.userRepository.findOneByEmail(createUserDto.email)) {
      throw new ConflictException('This email is already in use');
    }

    if (await this.userRepository.findOneByUsername(createUserDto.username)) {
      throw new ConflictException('This username is already in use');
    }

    const hash = await this.hashProvider.generateHash(createUserDto.password);

    createUserDto.password = hash;
    return await this.userRepository.save(createUserDto);
  }
}
