import { TestBed } from '@angular/core/testing';
import { Result, ok, err } from '../core/domain/result';
import { STORAGE, StoragePort, StorageError } from '../core/ports/storage.port';
import { STORAGE_KEY } from '../core/domain/storage-schema';
import { TeamDraft } from '../core/domain/model';
import { TeamService } from './team.service';

class MemoryStorage implements StoragePort {
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

const draft = (overrides: Partial<TeamDraft> = {}): TeamDraft => ({
  name: '  Équipe    Alpha ',
  durationSec: 900,
  allocationMode: 'equal',
  members: [
    { id: 'tmp-1', name: 'camille', allocatedSec: 0 },
    { id: 'tmp-2', name: 'Thomas', allocatedSec: 0 },
  ],
  ...overrides,
});

// S-E2-05 : enregistrer l'équipe, la retrouver à la visite suivante (FR-1, FR-6, FR-24).
describe('TeamService (S-E2-05)', () => {
  let memory: MemoryStorage;

  beforeEach(() => {
    memory = new MemoryStorage();
    TestBed.configureTestingModule({ providers: [{ provide: STORAGE, useValue: memory }] });
  });

  it('critère 2 : commit normalise, répartit à égalité (450 s) et persiste dans scrum-timer:v1', () => {
    const service = TestBed.inject(TeamService);
    const result = service.commit(draft());
    expect(result.ok).toBeTrue();
    expect(service.team()?.name).toBe('Équipe Alpha');
    expect(service.team()?.allocationMode).toBe('equal');
    expect(service.team()?.members.map((m) => [m.name, m.allocatedSec])).toEqual([
      ['Camille', 450],
      ['Thomas', 450],
    ]);
    const stored = JSON.parse(memory.data.get(STORAGE_KEY) ?? '{}');
    expect(stored.team.members[0].allocatedSec).toBe(450);
  });

  it('critère 4 : après un redémarrage, l\'équipe est retrouvée sans ressaisie', () => {
    TestBed.inject(TeamService).commit(draft());
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: STORAGE, useValue: memory }] });
    const restarted = TestBed.inject(TeamService);
    expect(restarted.hasTeam()).toBeTrue();
    expect(restarted.team()?.members.length).toBe(2);
  });

  it('une équipe invalide est refusée avec ses erreurs et rien n\'est persisté', () => {
    const service = TestBed.inject(TeamService);
    const result = service.commit(draft({ members: [{ id: 'x', name: 'Seul', allocatedSec: 0 }] }));
    expect(result.ok).toBeFalse();
    if (!result.ok) expect(result.error.map((e) => e.code)).toContain('MEMBER_COUNT_MIN');
    expect(memory.data.has(STORAGE_KEY)).toBeFalse();
    expect(service.hasTeam()).toBeFalse();
  });
});
