import { Component, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-session',
  imports: [RouterLink],
  template: `
    <section class="card">
      <h1>Session</h1>

      @if (session.team().members.length === 0) {
        <p>Aucune équipe enregistrée.</p>
        <a routerLink="/equipe">Configurer l'équipe</a>
      } @else {
        @if (session.session().status === 'idle') {
          <button type="button" (click)="session.start()">Démarrer la session</button>
        }

        @if (session.currentMember(); as member) {
          <p class="speaker">La parole est à <strong>{{ member.name }}</strong></p>
          <p class="clock" [class.over]="(session.remainingSec() ?? 0) < 0" aria-live="polite">
            {{ formatSec(session.remainingSec() ?? 0) }}
          </p>
          @if ((session.remainingSec() ?? 0) < 0) {
            <p class="alert" role="alert">Temps dépassé</p>
          }

          <div class="actions">
            @if (session.session().status === 'running') {
              <button type="button" class="ghost" (click)="session.pause()">Pause</button>
            } @else {
              <button type="button" class="ghost" (click)="session.resume()">Reprendre</button>
            }
            <button type="button" (click)="session.next()">Suivant</button>
          </div>
        }

        @if (session.session().status === 'finished') {
          <p>Tour terminé.</p>
          <button type="button" (click)="openSummary()">Voir le bilan</button>
        }
      }
    </section>
  `,
  styles: `
    .card { display: grid; gap: 1rem; text-align: center; }
    .clock { font-size: 4rem; font-variant-numeric: tabular-nums; margin: 0; }
    .clock.over { color: #b91c1c; }
    .speaker { font-size: 1.25rem; margin: 0; }
    .alert { color: #b91c1c; font-weight: 700; }
    .actions { display: flex; gap: .5rem; justify-content: center; }
  `,
})
export class SessionComponent implements OnDestroy {
  readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly ticker = setInterval(() => this.session.tick(), 250);

  formatSec(total: number): string {
    const sign = total < 0 ? '-' : '';
    const abs = Math.abs(total);
    const m = Math.floor(abs / 60).toString().padStart(2, '0');
    const s = (abs % 60).toString().padStart(2, '0');
    return `${sign}${m}:${s}`;
  }

  openSummary(): void {
    this.router.navigateByUrl('/bilan');
  }

  ngOnDestroy(): void {
    clearInterval(this.ticker);
  }
}
