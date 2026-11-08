// Schéma persisté versionné (architecture 3.4, ADR-05). Fonctions pures.
import { AllocationMode, Member, Team } from './model';
import { Result, err, ok } from './result';
import { validateTeam } from './validation';

export const STORAGE_KEY = 'scrum-timer:v1';
export const BACKUP_KEY = 'scrum-timer:v1:backup';

export interface AppSettings {
  readonly soundEnabled: boolean;
}

/** Enveloppe persistée. `session` reste null jusqu'à l'epic E4. */
export interface StoredRootV1 {
  readonly schemaVersion: 1;
  readonly team: Team | null;
  readonly settings: AppSettings;
  readonly session: null;
}

/** Racine vide : aucune équipe, son activé (FR-18). */
export function emptyRoot(): StoredRootV1 {
  return { schemaVersion: 1, team: null, settings: { soundEnabled: true }, session: null };
}

/**
 * Lit le contenu brut. Toute structure inconnue, version différente de 1 ou invariant violé
 * renvoie une erreur : l'appelant conserve le brut dans la sauvegarde (ADR-05).
 */
export function parseStoredRoot(raw: string): Result<StoredRootV1, 'UNREADABLE'> {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return err('UNREADABLE');
  }
  if (!isRecord(data) || data['schemaVersion'] !== 1 || data['session'] !== null) return err('UNREADABLE');

  const settings = data['settings'];
  if (!isRecord(settings) || typeof settings['soundEnabled'] !== 'boolean') return err('UNREADABLE');
  const appSettings: AppSettings = { soundEnabled: settings['soundEnabled'] };

  if (data['team'] === null) return ok({ schemaVersion: 1, team: null, settings: appSettings, session: null });

  const team = readTeam(data['team']);
  if (!team || validateTeam(team).length > 0) return err('UNREADABLE');
  return ok({ schemaVersion: 1, team, settings: appSettings, session: null });
}

function readTeam(value: unknown): Team | null {
  if (!isRecord(value)) return null;
  const { id, name, durationSec, allocationMode, members } = value;
  if (typeof id !== 'string' || typeof name !== 'string' || typeof durationSec !== 'number') return null;
  if (allocationMode !== 'equal' && allocationMode !== 'manual') return null;
  if (!Array.isArray(members)) return null;

  const parsed: Member[] = [];
  for (const member of members) {
    if (!isRecord(member)) return null;
    const memberId = member['id'];
    const memberName = member['name'];
    const allocatedSec = member['allocatedSec'];
    if (typeof memberId !== 'string' || typeof memberName !== 'string' || typeof allocatedSec !== 'number') {
      return null;
    }
    parsed.push({ id: memberId, name: memberName, allocatedSec });
  }
  return { id, name, durationSec, allocationMode: allocationMode as AllocationMode, members: parsed };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
