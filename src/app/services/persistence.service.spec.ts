import { TestBed } from '@angular/core/testing';
import { STORAGE, StoragePort, StorageError } from '../core/ports/storage.port';
import { Result, ok, err } from '../core/domain/result';
import { BACKUP_KEYS, BACKUP_KEY, STORAGE_KEY, emptyRoot } from '../core/domain/storage-schema';
import { PersistenceService } from './persistence.service';

// Stockage en mémoire, avec pannes simulées.
class MemoryStorage implements StoragePort {
  readonly data = new Map<string, string>();
  readFailure = false;
  writeFailure: StorageError | null = null;

  read(key: string): Result<string | null, 'STORAGE_UNAVAILABLE'> {
    if (this.readFailure) return err('STORAGE_UNAVAILABLE');
    return ok(this.data.get(key) ?? null);
  }
  write(key: string, value: string): Result<void, StorageError> {
    if (this.writeFailure) return err(this.writeFailure);
    this.data.set(key, value);
    return ok(undefined);
  }
  remove(key: string): Result<void, 'STORAGE_UNAVAILABLE'> {
    this.data.delete(key);
    return ok(undefined);
  }
}

// S-E2-03 : lecture tolérante et erreurs d'écriture.
describe('PersistenceService (S-E2-03)', () => {
  let memory: MemoryStorage;
  let service: PersistenceService;

  beforeEach(() => {
    memory = new MemoryStorage();
    TestBed.configureTestingModule({ providers: [{ provide: STORAGE, useValue: memory }] });
    service = TestBed.inject(PersistenceService);
  });

  it('critère 1 : clé absente, résultat vide et aucun message', () => {
    expect(service.load()).toEqual(emptyRoot());
    expect(service.dataIssue()).toBe('none');
  });

  it('critère 2 : une racine valide est restaurée', () => {
    const root = { ...emptyRoot(), settings: { soundEnabled: false } };
    memory.data.set(STORAGE_KEY, JSON.stringify(root));
    expect(service.load()).toEqual(root);
  });

  it('critère 3 : contenu illisible copié dans la sauvegarde, équipe vide, message, sans recopie', () => {
    const raw = JSON.stringify({ schemaVersion: 2, team: null, settings: { soundEnabled: true }, session: null });
    memory.data.set(STORAGE_KEY, raw);
    expect(service.load().team).toBeNull();
    expect(service.dataIssue()).toBe('unreadable');
    expect(memory.data.get(BACKUP_KEY)).toBe(raw);

    memory.data.set(STORAGE_KEY, '{nouveau brut');
    service.load();
    expect(memory.data.get(BACKUP_KEY)).toBe(raw);
  });

  it('I-6 : deux données illisibles successives sont conservées, sans recopie de la même donnée', () => {
    const first = '{premier brut';
    const second = '{second brut';
    memory.data.set(STORAGE_KEY, first);
    service.load();
    // Une nouvelle équipe remplace la clé principale, puis une seconde corruption survient.
    memory.data.set(STORAGE_KEY, JSON.stringify(emptyRoot()));
    service.load();
    memory.data.set(STORAGE_KEY, second);
    service.load();
    service.load();
    expect(memory.data.get(BACKUP_KEYS[0])).toBe(first);
    expect(memory.data.get(BACKUP_KEYS[1])).toBe(second);
    expect(memory.data.get(BACKUP_KEYS[2])).toBeUndefined();
  });

  it('N-3 : quatre données illisibles, les trois copies ne sont pas écrasées sans signal (perte signalée)', () => {
    const [a, b, c, d] = ['{brut A', '{brut B', '{brut C', '{brut D'];
    for (const raw of [a, b, c]) {
      memory.data.set(STORAGE_KEY, raw);
      service.load();
    }
    expect(service.backupLost()).toBeFalse();

    memory.data.set(STORAGE_KEY, d);
    service.load();
    // Politique ADR-05 : la dernière copie est remplacée, mais la perte doit être signalée.
    expect(memory.data.get(BACKUP_KEYS[2])).toBe(d);
    expect(service.backupLost()).toBeTrue();
  });

  it('M-A : si l\'écriture de la copie échoue, la perte n\'est pas signalée', () => {
    const [a, b, c, d] = ['{brut A', '{brut B', '{brut C', '{brut D'];
    for (const raw of [a, b, c]) {
      memory.data.set(STORAGE_KEY, raw);
      service.load();
    }
    memory.writeFailure = 'STORAGE_QUOTA';
    memory.data.set(STORAGE_KEY, d);
    service.load();
    // La copie n'a pas été remplacée : C reste en place, donc aucune perte à signaler.
    expect(memory.data.get(BACKUP_KEYS[2])).toBe(c);
    expect(service.backupLost()).toBeFalse();
  });

  it('N-3 : une donnée déjà conservée ne déclenche pas de perte', () => {
    const [a, b, c] = ['{brut A', '{brut B', '{brut C'];
    for (const raw of [a, b, c, c, a]) {
      memory.data.set(STORAGE_KEY, raw);
      service.load();
    }
    expect(service.backupLost()).toBeFalse();
  });

  it('I-6 : un échec d\'écriture de la sauvegarde est signalé (santé unavailable)', () => {
    memory.writeFailure = 'STORAGE_UNAVAILABLE';
    memory.data.set(STORAGE_KEY, '{brut');
    service.load();
    expect(service.health()).toBe('unavailable');
  });

  it('critère 4 : QuotaExceeded renvoie STORAGE_QUOTA, santé degraded, aucune exception', () => {
    memory.writeFailure = 'STORAGE_QUOTA';
    expect(service.save(emptyRoot())).toEqual({ ok: false, error: 'STORAGE_QUOTA' });
    expect(service.health()).toBe('degraded');
  });

  it('critère 5 : accès refusé à la lecture, santé unavailable, mémoire vive', () => {
    memory.readFailure = true;
    expect(service.load()).toEqual(emptyRoot());
    expect(service.health()).toBe('unavailable');
  });
});
