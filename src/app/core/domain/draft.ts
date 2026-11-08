// Brouillon d'équipe : ajout d'un Membre (FR-2, INV-01). Fonctions pures.
import { ValidationError } from './errors';
import { Member, TeamDraft } from './model';
import { normalizeMemberName } from './normalize';
import { Result, err, ok } from './result';
import { validateMemberName } from './validation';

export const MAX_MEMBERS = 15;

/**
 * Ajoute un Membre en fin de liste. Refusé au 15e Membre (MEMBER_COUNT_MAX) et si le prénom est invalide
 * ou en doublon. Le brouillon d'origine n'est jamais modifié.
 */
export function addMemberToDraft(draft: TeamDraft, raw: string, newId: string): Result<TeamDraft, ValidationError[]> {
  if (draft.members.length >= MAX_MEMBERS) {
    return err([{ code: 'MEMBER_COUNT_MAX', field: 'members' }]);
  }
  const errors = validateMemberName(raw, draft.members);
  if (errors.length > 0) return err(errors);

  const member: Member = { id: newId, name: normalizeMemberName(raw), allocatedSec: 0 };
  return ok({ ...draft, members: [...draft.members, member] });
}
