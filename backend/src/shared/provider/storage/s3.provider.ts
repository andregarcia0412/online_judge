import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  StorageObjectNotFoundError,
  StorageOperationError,
} from './error/storage.errors';
import { StorageProviderPort } from './storage.provider.port';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Provider implements StorageProviderPort {
  private readonly logger = new Logger(S3Provider.name);
  private readonly s3Client: S3Client;

  constructor(configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.getOrThrow<string>('AWS_REGION'),
    });
  }

  async uploadFile(
    bucketName: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: buffer,
          ContentType: mimeType,
        }),
      );
      return fileName;
    } catch (e) {
      throw this.translateError(e, 'upload', fileName);
    }
  }

  async downloadFile(bucketName: string, fileName: string): Promise<Buffer> {
    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({ Bucket: bucketName, Key: fileName }),
      );

      if (!response.Body) {
        throw new StorageObjectNotFoundError(fileName);
      }

      return Buffer.from(await response.Body.transformToByteArray());
    } catch (e) {
      throw this.translateError(e, 'download', fileName);
    }
  }

  getTemporaryUrl(
    bucketName: string,
    fileName: string,
    expiresInSeconds = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: fileName,
        }),
      );
    } catch (e) {
      throw this.translateError(e, 'delete', fileName);
    }
  }

  private translateError(
    error: unknown,
    operation: string,
    key: string,
  ): Error {
    if (error instanceof StorageObjectNotFoundError) return error;

    if (error instanceof S3ServiceException) {
      if (
        error.name === 'NoSuchKey' ||
        error.$metadata.httpStatusCode === 404
      ) {
        return new StorageObjectNotFoundError(key);
      }
      this.logger.error(`S3 ${operation} failed at '${key}': ${error.name}`);
    }

    return new StorageOperationError(operation, key, { cause: error });
  }
}
