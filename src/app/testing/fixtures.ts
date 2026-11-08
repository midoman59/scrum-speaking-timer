import { Team } from '../core/domain/model';
import { STORAGE_KEY } from '../core/domain/storage-schema';
import { MemoryStorage } from './memory-storage';

/** Équipe valide de référence : 15 min, deux Membres à 450 s (répartition égale). */
export function sampleTeam(): Team {
  return {
    id: 't1',
    name: 'Équipe Alpha',
    durationSec: 900,
    allocationMode: 'equal',
    members: [
      { id: 'm1', name: 'Camille', allocatedSec: 450 },
      { id: 'm2', name: 'Thomas', allocatedSec: 450 },
    ],
  };
}

/** Écrit une équipe dans le stockage de test, comme après une visite précédente. */
export function seedTeam(storage: MemoryStorage, team: Team = sampleTeam()): void {
  storage.data.set(
    STORAGE_KEY,
    JSON.stringify({ schemaVersion: 1, team, settings: { soundEnabled: true }, session: null }),
  );
}
