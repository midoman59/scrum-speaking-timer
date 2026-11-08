import { Component, inject, signal } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-summary',
  template: `
    <section class="card">
      <h1>Bilan</h1>

      <table>
        <thead>
          <tr><th>Membre</th><th>Parlé</th><th>Alloué</th></tr>
        </thead>
        <tbody>
          @for (m of session.team().members; track m.id) {
            <tr [class.over]="m.spokenSec > m.allocatedSec">
              <td>{{ m.name }}</td>
              <td>{{ format(m.spokenSec) }}</td>
              <td>{{ format(m.allocatedSec) }}</td>
            </tr>
          }
        </tbody>
      </table>

      <div class="actions">
        <button type="button" (click)="copy()">Copier le bilan</button>
        <button type="button" class="ghost" (click)="session.reset()">Nouvelle session</button>
      </div>
      @if (copied()) {
        <p role="status">Bilan copié.</p>
      }
    </section>
  `,
  styles: `
    .card { display: grid; gap: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: .5rem; border-bottom: 1px solid #e2e8f0; }
    tr.over td { color: #b91c1c; font-weight: 600; }
    .actions { display: flex; gap: .5rem; justify-content: flex-end; }
  `,
})
export class SummaryComponent {
  readonly session = inject(SessionService);
  readonly copied = signal(false);

  format(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  async copy(): Promise<void> {
    const lines = this.session.team().members.map((m) => `${m.name} : ${this.format(m.spokenSec)} / ${this.format(m.allocatedSec)}`);
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      this.copied.set(true);
    } catch {
      this.copied.set(false);
    }
  }
}
