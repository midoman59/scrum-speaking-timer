import { InjectionToken } from '@angular/core';
import { Result } from '../domain/result';

/** Erreurs de stockage remontées sous forme de codes, jamais d'exceptions (ADR-05). */
export type StorageError = 'STORAGE_UNAVAILABLE' | 'STORAGE_QUOTA';

/** Port de stockage clé/valeur. Les implémentations ne lèvent jamais d'exception. */
export interface StoragePort {
  read(key: string): Result<string | null, 'STORAGE_UNAVAILABLE'>;
  write(key: string, value: string): Result<void, StorageError>;
  remove(key: string): Result<void, 'STORAGE_UNAVAILABLE'>;
}

export const STORAGE = new InjectionToken<StoragePort>('StoragePort');
