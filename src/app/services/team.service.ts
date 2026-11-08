import { Injectable, inject, signal } from '@angular/core';
import { allocateEqual } from '../core/domain/allocation';
import { ValidationError } from '../core/domain/errors';
import { Team, TeamDraft } from '../core/domain/model';
import { normalizeMemberName, normalizeTeamName } from '../core/domain/normalize';
import { Result, err, ok } from '../core/domain/result';
import { AppSettings, StoredRootV1 } from '../core/domain/storage-schema';
import { validateTeam } from '../core/domain/validation';
import { PersistenceService } from './persistence.service';
import { newId } from './ids';

/** Équipe unique de l'appareil (ADR-18) : état en signal, persistance à chaque mutation. */
@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly persistence = inject(PersistenceService);
  private readonly initial: StoredRootV1 = this.persistence.load();
  private readonly settings: AppSettings = this.initial.settings;

  readonly team = signal<Team | null>(this.initial.team);

  hasTeam(): boolean {
    return this.team() !== null;
  }

  /**
   * Valide, normalise et enregistre l'équipe. En répartition égale, les temps alloués sont recalculés.
   * Les erreurs métier sont renvoyées, jamais levées. La mémoire vive garde l'équipe si le stockage échoue (FR-25).
   */
  commit(draft: TeamDraft): Result<Team, ValidationError[]> {
    const count = draft.members.length;
    const shares = draft.allocationMode === 'equal' ? allocateEqual(draft.durationSec, count) : null;
    const candidate: TeamDraft = {
      name: normalizeTeamName(draft.name),
      durationSec: draft.durationSec,
      allocationMode: draft.allocationMode,
      members: draft.members.map((member, index) => ({
        id: member.id,
        name: normalizeMemberName(member.name),
        allocatedSec: shares ? shares[index] : member.allocatedSec,
      })),
    };

    const errors = validateTeam(candidate);
    if (errors.length > 0) return err(errors);

    const team: Team = { id: newId(), ...candidate };
    this.persistence.save({ schemaVersion: 1, team, settings: this.settings, session: null });
    this.team.set(team);
    return ok(team);
  }
}
