import { addMemberToDraft } from './draft';
import { TeamDraft } from './model';

// S-E2-07 : ajout d'un Membre au brouillon, limite de 15 et erreurs (FR-2, INV-01).
describe('Brouillon d\'équipe (S-E2-07)', () => {
  const draftWith = (names: string[]): TeamDraft => ({
    name: 'Équipe Alpha',
    durationSec: 900,
    allocationMode: 'equal',
    members: names.map((name, index) => ({ id: `m${index}`, name, allocatedSec: 0 })),
  });

  it('ajoute un Membre en fin de liste, prénom normalisé, brouillon d\'origine inchangé', () => {
    const original = draftWith(['Camille']);
    const result = addMemberToDraft(original, 'thomas', 'new-id');
    expect(result.ok).toBeTrue();
    if (result.ok) {
      expect(result.value.members.map((m) => m.name)).toEqual(['Camille', 'Thomas']);
      expect(result.value.members[1].id).toBe('new-id');
    }
    expect(original.members.length).toBe(1);
  });

  it('critère 1 : au 15e Membre, l\'ajout est refusé avec MEMBER_COUNT_MAX', () => {
    const names = Array.from({ length: 15 }, (_, i) => `Membre${String.fromCharCode(65 + i)}`);
    const result = addMemberToDraft(draftWith(names.map((n) => n.replace(/[0-9]/g, ''))), 'Zoé', 'x');
    expect(result.ok).toBeFalse();
    if (!result.ok) expect(result.error.map((e) => e.code)).toEqual(['MEMBER_COUNT_MAX']);
  });

  it('critère 2 : un prénom invalide bloque l\'ajout et renvoie l\'erreur du domaine', () => {
    const result = addMemberToDraft(draftWith(['Camille']), 'Jean3', 'x');
    expect(result.ok).toBeFalse();
    if (!result.ok) expect(result.error.map((e) => e.code)).toEqual(['MEMBER_NAME_INVALID_CHARS']);
  });

  it('un doublon bloque l\'ajout', () => {
    const result = addMemberToDraft(draftWith(['Thomas']), 'thomas ', 'x');
    expect(result.ok).toBeFalse();
    if (!result.ok) expect(result.error.map((e) => e.code)).toEqual(['MEMBER_NAME_DUPLICATE']);
  });
});
