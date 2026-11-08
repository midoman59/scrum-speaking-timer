import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { messageFor } from '../../core/domain/messages';
import { formatMmSs } from '../../core/domain/format';
import { validateTeam } from '../../core/domain/validation';
import { TeamService } from '../../services/team.service';

/** Écran de préparation de Session (E-2, S-E2-12). La garde de route garantit une équipe. */
@Component({
  selector: 'app-preparation-page',
  imports: [RouterLink],
  template: `
    <section class="page">
      <h1>Préparer la session</h1>

      @if (team(); as team) {
        <h2>{{ team.name }}</h2>
        <p class="duration">Durée de la cérémonie : {{ durationLabel(team.durationSec) }}</p>

        <ol class="member-list">
          @for (member of team.members; track member.id; let i = $index) {
            <li>
              <span class="position">{{ i + 1 }}</span>
              <span class="name">{{ member.name }}</span>
              <span class="time">{{ time(member.allocatedSec) }}</span>
            </li>
          }
        </ol>

        @if (reason(); as text) {
          <p id="start-help" class="help" role="status">{{ text }}</p>
        }

        <div class="actions">
          <button
            type="button"
            [disabled]="reason() !== null"
            [attr.aria-describedby]="reason() ? 'start-help' : null"
            (click)="start()"
          >
            Démarrer la session
          </button>
        </div>

        <p class="new-team"><a routerLink="/equipe">Nouvelle équipe</a></p>
      }
    </section>
  `,
  styles: `
    .page { display: grid; gap: var(--space-4); max-width: 560px; }
    h2 { margin: 0; }
    .duration { margin: 0; color: var(--color-text-muted); }
    .member-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); }
    .member-list li {
      display: flex;
      gap: var(--space-3);
      align-items: center;
      min-height: var(--target-min);
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    .position { color: var(--color-text-muted); font-size: var(--text-xs); min-width: 1.5em; }
    .name { flex: 1; font-size: var(--text-lg); font-weight: 600; }
    .time { font-variant-numeric: tabular-nums; font-size: var(--text-sm); }
    .help { margin: 0; color: var(--color-text-muted); font-size: var(--text-sm); }
    .actions { display: flex; justify-content: flex-end; }
    .new-team a {
      display: inline-flex;
      align-items: center;
      min-height: var(--target-min);
    }
  `,
})
export class PreparationPage {
  private readonly teams = inject(TeamService);
  private readonly router = inject(Router);

  readonly team = this.teams.team;

  /** Motif qui empêche le démarrage, ou null si la Session peut commencer. */
  reason(): string | null {
    const team = this.team();
    if (!team) return null;
    const errors = validateTeam(team);
    if (errors.length === 0) return null;
    return messageFor(errors[0].code, { count: team.members.length });
  }

  durationLabel(durationSec: number): string {
    return `${Math.round(durationSec / 60)} min`;
  }

  time(seconds: number): string {
    return formatMmSs(seconds);
  }

  start(): void {
    void this.router.navigateByUrl('/session');
  }
}
