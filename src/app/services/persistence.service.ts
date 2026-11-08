import { Injectable, inject, signal } from '@angular/core';
import { Result } from '../core/domain/result';
import { BACKUP_KEYS, STORAGE_KEY, StoredRootV1, emptyRoot, parseStoredRoot } from '../core/domain/storage-schema';
import { STORAGE, StorageError } from '../core/ports/storage.port';

export type StorageHealth = 'ok' | 'degraded' | 'unavailable';
export type DataIssue = 'none' | 'unreadable';

/** Message FR-25 pour les données illisibles (bandeau B-2). */
export const UNREADABLE_DATA_MESSAGE =
  'Les données enregistrées sont illisibles et ont été ignorées. Vous pouvez importer un fichier de sauvegarde.';

/** Message de perte d'une sauvegarde après quatre données illisibles (N-3). Texte proposé, à valider par le PO. */
export const BACKUP_LOST_MESSAGE =
  'Une donnée illisible précédente a été remplacée dans la sauvegarde et ne peut plus être récupérée.';

/** Message FR-25 pour le stockage refusé ou plein (bandeau B-1, PRD FR-25). */
export const STORAGE_REFUSED_MESSAGE =
  'Vos données ne seront pas conservées après fermeture. Exportez votre équipe pour la sauvegarder.';

/** Lecture et écriture de la racine persistée, avec sauvegarde des données illisibles (ADR-05). */
@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private readonly storage = inject(STORAGE);

  readonly health = signal<StorageHealth>('ok');
  readonly dataIssue = signal<DataIssue>('none');
  /** Vrai quand une sauvegarde existante a été remplacée faute d'emplacement libre (N-3). */
  readonly backupLost = signal(false);
  /** Nombre d'incidents de stockage depuis le démarrage (I-A) : chaque passage à une santé dégradée le compte. */
  readonly incidents = signal(0);

  /** Charge la racine. Ne lève jamais d'exception : en cas d'échec, renvoie une racine vide. */
  load(): StoredRootV1 {
    const read = this.storage.read(STORAGE_KEY);
    if (!read.ok) {
      this.fail('unavailable');
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
    this.fail(written.error === 'STORAGE_QUOTA' ? 'degraded' : 'unavailable');
    return written;
  }

  /** Passe la santé à un état dégradé et compte l'incident, pour que le bandeau B-1 revienne (I-A). */
  private fail(health: Exclude<StorageHealth, 'ok'>): void {
    this.health.set(health);
    this.incidents.update((count) => count + 1);
  }

  /**
   * Garde le brut illisible (ADR-05, I-6) : une donnée déjà conservée n'est pas recopiée. La première case libre
   * reçoit le brut ; si toutes sont prises, la dernière est remplacée et `backupLost` passe à vrai (N-3, pas de
   * perte silencieuse). Un échec d'écriture ou de lecture passe la santé à unavailable.
   */
  private keepBackup(raw: string): void {
    let free: string | null = null;
    for (const key of BACKUP_KEYS) {
      const existing = this.storage.read(key);
      if (!existing.ok) {
        this.fail('unavailable');
        return;
      }
      if (existing.value === raw) return;
      if (existing.value === null && free === null) free = key;
    }
    if (free === null) this.backupLost.set(true);
    const target = free ?? BACKUP_KEYS[BACKUP_KEYS.length - 1];
    const written = this.storage.write(target, raw);
    if (!written.ok) this.fail('unavailable');
  }
}
