export abstract class StorageError extends Error {}

export class StorageObjectNotFoundError extends StorageError {
  constructor(key: string) {
    super(`Object not found: ${key}`);
    this.name = 'StorageObjectNotFoundError';
  }
}

export class StorageOperationError extends StorageError {
  constructor(operation: string, key: string, options?: { cause?: unknown }) {
    super(`Storage ${operation} failed for ${key}`, options);
    this.name = 'StorageOperationError';
  }
}
