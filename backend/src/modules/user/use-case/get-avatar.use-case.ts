import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StorageProviderPort } from 'src/shared/provider/storage/storage.provider.port';
import { UserRepositoryPort } from '../interface/user.repository.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetAvatarUseCase {
  private readonly bucketName: string;

  constructor(
    @Inject(StorageProviderPort)
    private readonly storageProvider: StorageProviderPort,
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = configService.getOrThrow<string>('S3_BUCKET');
  }

  async execute(id: string): Promise<string | null> {
    const user = await this.userRepository.findOneById(id);
    if (!user) throw new NotFoundException('User not found');

    if (!user.avatarKey) return null;

    return await this.storageProvider.getTemporaryUrl(
      this.bucketName,
      user.avatarKey,
    );
  }
}
