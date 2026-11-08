import { Injectable, inject, signal } from '@angular/core';
import { Result } from '../core/domain/result';
import { BACKUP_KEY, STORAGE_KEY, StoredRootV1, emptyRoot, parseStoredRoot } from '../core/domain/storage-schema';
import { STORAGE, StorageError } from '../core/ports/storage.port';

export type StorageHealth = 'ok' | 'degraded' | 'unavailable';
export type DataIssue = 'none' | 'unreadable';

/** Message FR-25 pour les données illisibles (bandeau B-2). */
export const UNREADABLE_DATA_MESSAGE =
  'Les données enregistrées sont illisibles et ont été ignorées. Vous pouvez importer un fichier de sauvegarde.';

/** Lecture et écriture de la racine persistée, avec sauvegarde des données illisibles (ADR-05). */
@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private readonly storage = inject(STORAGE);

  readonly health = signal<StorageHealth>('ok');
  readonly dataIssue = signal<DataIssue>('none');

  /** Charge la racine. Ne lève jamais d'exception : en cas d'échec, renvoie une racine vide. */
  load(): StoredRootV1 {
    const read = this.storage.read(STORAGE_KEY);
    if (!read.ok) {
      this.health.set('unavailable');
      return emptyRoot();
    }
    if (read.value === null) return emptyRoot();

    const parsed = parseStoredRoot(read.value);
    if (parsed.ok) return parsed.value;

    this.keepBackup(read.value);
    this.dataIssue.set('unreadable');
    return emptyRoot();
  }

  save(root: StoredRootV1): Result<void, StorageError> {
    const written = this.storage.write(STORAGE_KEY, JSON.stringify(root));
    if (written.ok) {
      this.health.set('ok');
      return written;
    }
    this.health.set(written.error === 'STORAGE_QUOTA' ? 'degraded' : 'unavailable');
    return written;
  }

  /** Copie le brut une seule fois : une sauvegarde existante n'est jamais écrasée. */
  private keepBackup(raw: string): void {
    const existing = this.storage.read(BACKUP_KEY);
    if (existing.ok && existing.value === null) {
      this.storage.write(BACKUP_KEY, raw);
    }
  }
}
