import { Result, ok } from '../core/domain/result';
import { STORAGE, StoragePort, StorageError } from '../core/ports/storage.port';
import { Provider } from '@angular/core';

/** Stockage en mémoire pour les tests : aucune écriture dans le navigateur. */
export class MemoryStorage implements StoragePort {
  readonly data = new Map<string, string>();

  read(key: string): Result<string | null, 'STORAGE_UNAVAILABLE'> {
    return ok(this.data.get(key) ?? null);
  }

  write(key: string, value: string): Result<void, StorageError> {
    this.data.set(key, value);
    return ok(undefined);
  }

  remove(key: string): Result<void, 'STORAGE_UNAVAILABLE'> {
    this.data.delete(key);
    return ok(undefined);
  }
}

/** Fournisseur de test : un stockage en mémoire pour le port STORAGE. */
export function provideMemoryStorage(storage: MemoryStorage = new MemoryStorage()): Provider {
  return { provide: STORAGE, useValue: storage };
}
