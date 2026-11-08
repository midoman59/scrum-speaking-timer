import { Result, err, ok } from '../domain/result';
import { StoragePort, StorageError } from '../ports/storage.port';

/** Implémentation navigateur du port de stockage. Chaque accès est protégé (try/catch). */
export class LocalStorageAdapter implements StoragePort {
  constructor(private readonly resolve: () => Storage) {}

  read(key: string): Result<string | null, 'STORAGE_UNAVAILABLE'> {
    try {
      return ok(this.resolve().getItem(key));
    } catch {
      return err('STORAGE_UNAVAILABLE');
    }
  }

  write(key: string, value: string): Result<void, StorageError> {
    try {
      this.resolve().setItem(key, value);
      return ok(undefined);
    } catch (error) {
      return err(isQuotaError(error) ? 'STORAGE_QUOTA' : 'STORAGE_UNAVAILABLE');
    }
  }

  remove(key: string): Result<void, 'STORAGE_UNAVAILABLE'> {
    try {
      this.resolve().removeItem(key);
      return ok(undefined);
    } catch {
      return err('STORAGE_UNAVAILABLE');
    }
  }
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}
