// Table unique des messages d'erreur. Textes exacts du PRD section 6 (S-E1-08).
import { ValidationCode } from './errors';

export interface MessageParams {
  readonly count?: number;
  readonly name?: string;
  readonly delta?: number;
}

const MESSAGES: Record<ValidationCode, (p: MessageParams) => string> = {
  TEAM_NAME_REQUIRED: () => 'Donnez un nom à votre équipe.',
  TEAM_NAME_TOO_LONG: () => 'Le nom ne doit pas dépasser 50 caractères.',
  TEAM_NAME_INVALID_CHARS: () => 'Caractères non autorisés dans le nom de l\'équipe.',
  MEMBER_NAME_REQUIRED: () => 'Saisissez un prénom.',
  MEMBER_NAME_TOO_LONG: () => 'Le prénom ne doit pas dépasser 30 caractères.',
  MEMBER_NAME_INVALID_CHARS: () => 'Un prénom ne peut contenir que des lettres, espaces, traits d\'union et apostrophes.',
  MEMBER_NAME_DUPLICATE: () => 'Ce prénom existe déjà dans l\'équipe.',
  MEMBER_COUNT_MIN: () => 'Ajoutez au moins 2 membres pour lancer une session.',
  MEMBER_COUNT_MAX: () => 'Une équipe ne peut pas dépasser 15 membres.',
  DURATION_REQUIRED: () => 'Indiquez la durée de la cérémonie.',
  DURATION_NOT_INTEGER: () => 'Saisissez un nombre entier de minutes.',
  DURATION_TOO_SHORT: () => 'La durée minimale est de 1 minute.',
  DURATION_TOO_LONG: () => 'La durée maximale est de 120 minutes.',
  DURATION_PER_MEMBER_TOO_SHORT: (p) =>
    `Avec ${p.count ?? 0} membres, chacun aurait moins de 30 secondes. Augmentez la durée ou retirez des membres.`,
  ALLOCATION_REQUIRED: (p) => `Indiquez le temps alloué à ${p.name ?? ''}.`,
  ALLOCATION_FORMAT: () => 'Format attendu : secondes (ex. 90) ou mm:ss (ex. 01:30).',
  ALLOCATION_TOO_SHORT: () => 'Le temps minimum est de 30 secondes.',
  ALLOCATION_TOO_LONG: () => 'Le temps dépasse la durée de la cérémonie.',
  ALLOCATION_SUM_MISMATCH: (p) => {
    const delta = p.delta ?? 0;
    return delta > 0 ? `Il manque ${delta} s pour atteindre la durée` : `Il y a ${-delta} s de trop`;
  },
};

/** Texte français d'un code de validation. */
export function messageFor(code: ValidationCode, params: MessageParams = {}): string {
  return MESSAGES[code](params);
}
