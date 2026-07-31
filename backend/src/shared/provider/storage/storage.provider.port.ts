export interface StorageProviderPort {
  uploadFile(
    bucketName: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string>;
  downloadFile(bucketName: string, fileName: string): Promise<Buffer>;
  getTemporaryUrl(
    bucketName: string,
    fileName: string,
    expiresInSeconds?: number,
  ): Promise<string>;
  deleteFile(bucketName: string, fileName: string): Promise<void>;
}

export const StorageProviderPort = Symbol('StorageProviderPort');
