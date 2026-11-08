import { ValidationCode, VALIDATION_CODES } from './errors';
import { MessageParams, messageFor } from './messages';

// S-E1-08 critère 5 : une table de messages unique, textes exacts du PRD section 6, pour chaque code.
const ATTENDU: Record<ValidationCode, [MessageParams, string]> = {
  TEAM_NAME_REQUIRED: [{}, 'Donnez un nom à votre équipe.'],
  TEAM_NAME_TOO_LONG: [{}, 'Le nom ne doit pas dépasser 50 caractères.'],
  TEAM_NAME_INVALID_CHARS: [{}, 'Caractères non autorisés dans le nom de l\'équipe.'],
  MEMBER_NAME_REQUIRED: [{}, 'Saisissez un prénom.'],
  MEMBER_NAME_TOO_LONG: [{}, 'Le prénom ne doit pas dépasser 30 caractères.'],
  MEMBER_NAME_INVALID_CHARS: [
    {},
    'Un prénom ne peut contenir que des lettres, espaces, traits d\'union et apostrophes.',
  ],
  MEMBER_NAME_DUPLICATE: [{}, 'Ce prénom existe déjà dans l\'équipe.'],
  MEMBER_COUNT_MIN: [{}, 'Ajoutez au moins 2 membres pour lancer une session.'],
  MEMBER_COUNT_MAX: [{}, 'Une équipe ne peut pas dépasser 15 membres.'],
  DURATION_REQUIRED: [{}, 'Indiquez la durée de la cérémonie.'],
  DURATION_NOT_INTEGER: [{}, 'Saisissez un nombre entier de minutes.'],
  DURATION_TOO_SHORT: [{}, 'La durée minimale est de 1 minute.'],
  DURATION_TOO_LONG: [{}, 'La durée maximale est de 120 minutes.'],
  DURATION_PER_MEMBER_TOO_SHORT: [
    { count: 6 },
    'Avec 6 membres, chacun aurait moins de 30 secondes. Augmentez la durée ou retirez des membres.',
  ],
  ALLOCATION_REQUIRED: [{ name: 'Thomas' }, 'Indiquez le temps alloué à Thomas.'],
  ALLOCATION_FORMAT: [{}, 'Format attendu : secondes (ex. 90) ou mm:ss (ex. 01:30).'],
  ALLOCATION_TOO_SHORT: [{}, 'Le temps minimum est de 30 secondes.'],
  ALLOCATION_TOO_LONG: [{}, 'Le temps dépasse la durée de la cérémonie.'],
  ALLOCATION_SUM_MISMATCH: [{ delta: 100 }, 'Il manque 100 s pour atteindre la durée'],
};

describe('Messages (S-E1-08)', () => {
  it('critère 5 : chaque code de la liste possède une entrée dans la table attendue', () => {
    expect(Object.keys(ATTENDU).sort()).toEqual([...VALIDATION_CODES].sort());
  });

  for (const code of VALIDATION_CODES) {
    it(`critère 5 : ${code} correspond au texte du PRD section 6`, () => {
      const [params, texte] = ATTENDU[code];
      expect(messageFor(code, params)).toBe(texte);
    });
  }

  it('critère 5 : somme des temps, cas négatif (« de trop »)', () => {
    expect(messageFor('ALLOCATION_SUM_MISMATCH', { delta: -30 })).toBe('Il y a 30 s de trop');
  });
});
