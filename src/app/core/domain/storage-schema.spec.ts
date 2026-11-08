import { emptyRoot, parseStoredRoot, STORAGE_KEY } from './storage-schema';

// S-E2-03 : schéma versionné et lecture tolérante (ADR-05, FR-24, FR-25).
describe('Schéma de stockage (S-E2-03)', () => {
  const validObject = {
    schemaVersion: 1,
    team: {
      id: 't1',
      name: 'Équipe Alpha',
      durationSec: 900,
      allocationMode: 'equal',
      members: [
        { id: 'm1', name: 'Camille', allocatedSec: 450 },
        { id: 'm2', name: 'Thomas', allocatedSec: 450 },
      ],
    },
    settings: { soundEnabled: false },
    session: null,
  };

  it('clé versionnée scrum-timer:v1', () => {
    expect(STORAGE_KEY).toBe('scrum-timer:v1');
  });

  it('un contenu StoredRootV1 valide est restauré (équipe et réglages)', () => {
    const result = parseStoredRoot(JSON.stringify(validObject));
    expect(result.ok).toBeTrue();
    if (result.ok) {
      expect(result.value.team?.name).toBe('Équipe Alpha');
      expect(result.value.settings.soundEnabled).toBeFalse();
    }
  });

  it('JSON invalide : lecture refusée', () => {
    expect(parseStoredRoot('{pas du json').ok).toBeFalse();
  });

  it('schemaVersion 2 : lecture refusée', () => {
    expect(parseStoredRoot(JSON.stringify({ ...validObject, schemaVersion: 2 })).ok).toBeFalse();
  });

  it('invariant violé (prénoms en doublon) : lecture refusée', () => {
    const broken = JSON.parse(JSON.stringify(validObject));
    broken.team.members[1].name = 'camille';
    expect(parseStoredRoot(JSON.stringify(broken)).ok).toBeFalse();
  });

  it('racine vide : pas d\'équipe, son activé par défaut', () => {
    expect(emptyRoot()).toEqual({ schemaVersion: 1, team: null, settings: { soundEnabled: true }, session: null });
  });
});
