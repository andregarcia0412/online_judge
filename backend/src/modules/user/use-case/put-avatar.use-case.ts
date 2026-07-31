import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { StorageProviderPort } from 'src/shared/provider/storage/storage.provider.port';
import { UserRepositoryPort } from '../interface/user.repository.port';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class PutAvatarUseCase {
  private readonly ALLOWED_IMAGE_TYPES = new Map([
    ['image/jpeg', 'jpg'],
    ['image/png', 'png'],
    ['image/webp', 'webp'],
  ]);
  private readonly bucketName: string;
  private readonly logger = new Logger(PutAvatarUseCase.name);

  constructor(
    @Inject(StorageProviderPort)
    private readonly storageProvider: StorageProviderPort,
    @Inject(UserRepositoryPort)
    private readonly userRepository: UserRepositoryPort,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = configService.getOrThrow<string>('S3_BUCKET');
  }

  async execute(id: string, file: Express.Multer.File): Promise<string> {
    const extension = this.ALLOWED_IMAGE_TYPES.get(file.mimetype);
    if (!extension) throw new BadRequestException('Unsupported Mimetype');

    const user = await this.userRepository.findOneById(id);
    if (!user) throw new NotFoundException('User not found');
    const previousKey = user.avatarKey;

    const key = `users/${id}/avatar/${randomUUID()}.${extension}`;
    await this.storageProvider.uploadFile(
      this.bucketName,
      key,
      file.buffer,
      file.mimetype,
    );

    user.avatarKey = key;
    await this.userRepository.save(user);

    if (previousKey) {
      try {
        await this.storageProvider.deleteFile(this.bucketName, previousKey);
      } catch {
        this.logger.warn(`Orphan profile picture: ${previousKey}`);
      }
    }

    return await this.storageProvider.getTemporaryUrl(this.bucketName, key);
  }
}
