import { VALIDATION_CODES } from './errors';
import { messageFor } from './messages';

// S-E1-08 critère 5 : une table de messages unique, textes exacts du PRD section 6.
describe('Messages (S-E1-08)', () => {
  it('critère 5 : chaque code possède exactement un texte français non vide', () => {
    for (const code of VALIDATION_CODES) {
      const text = messageFor(code, { count: 3, name: 'Thomas', delta: 100 });
      expect(text.length).toBeGreaterThan(0);
    }
  });

  it('textes exacts du PRD (section 6)', () => {
    expect(messageFor('TEAM_NAME_REQUIRED')).toBe('Donnez un nom à votre équipe.');
    expect(messageFor('MEMBER_NAME_DUPLICATE')).toBe('Ce prénom existe déjà dans l\'équipe.');
    expect(messageFor('DURATION_NOT_INTEGER')).toBe('Saisissez un nombre entier de minutes.');
    expect(messageFor('DURATION_PER_MEMBER_TOO_SHORT', { count: 6 })).toBe(
      'Avec 6 membres, chacun aurait moins de 30 secondes. Augmentez la durée ou retirez des membres.',
    );
    expect(messageFor('ALLOCATION_SUM_MISMATCH', { delta: 100 })).toBe('Il manque 100 s pour atteindre la durée');
    expect(messageFor('ALLOCATION_SUM_MISMATCH', { delta: -30 })).toBe('Il y a 30 s de trop');
  });
});
