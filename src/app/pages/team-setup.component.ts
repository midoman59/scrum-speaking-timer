import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { StorageService } from '../storage.service';
import { MAX_MEMBERS, MIN_MEMBERS, isValidMemberCount, splitEvenly } from '../timer.logic';
import { Member } from '../models';

@Component({
  selector: 'app-team-setup',
  template: `
    <section class="card">
      <h1>Équipe</h1>

      <label>
        Nom de l'équipe
        <input [value]="teamName()" (input)="teamName.set($any($event.target).value)" />
      </label>

      <label>
        Durée de la cérémonie (minutes)
        <input type="number" min="1" max="120" [value]="minutes()" (input)="minutes.set(+$any($event.target).value)" />
      </label>

      <h2>Membres ({{ names().length }}/{{ maxMembers }})</h2>
      <ul class="members">
        @for (name of names(); track $index) {
          <li>
            <input [value]="name" (input)="rename($index, $any($event.target).value)" aria-label="Prénom" />
            <button type="button" class="ghost" (click)="remove($index)" aria-label="Retirer">✕</button>
          </li>
        }
      </ul>
      <button type="button" class="ghost" (click)="add()" [disabled]="names().length >= maxMembers">+ Ajouter un membre</button>

      <p class="hint">
        Temps par personne : <strong>{{ perPersonLabel() }}</strong>
      </p>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }

      <div class="actions">
        <button type="button" (click)="save()">Enregistrer et continuer</button>
      </div>
    </section>
  `,
  styles: `
    .card { display: grid; gap: 1rem; }
    label { display: grid; gap: .25rem; font-weight: 600; }
    input { padding: .5rem; font: inherit; border: 1px solid #94a3b8; border-radius: 6px; }
    .members { list-style: none; padding: 0; display: grid; gap: .5rem; }
    .members li { display: flex; gap: .5rem; }
    .members input { flex: 1; }
    .hint { color: #475569; }
    .error { color: #b91c1c; font-weight: 600; }
    .actions { display: flex; justify-content: flex-end; }
  `,
})
export class TeamSetupComponent {
  private readonly session = inject(SessionService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  readonly maxMembers = MAX_MEMBERS;
  readonly teamName = signal(this.session.team().name);
  readonly minutes = signal(Math.round(this.session.team().durationSec / 60));
  readonly names = signal<string[]>(this.session.team().members.map((m) => m.name));
  readonly error = signal<string | null>(null);

  readonly perPersonLabel = computed(() => {
    const count = this.names().filter((n) => n.trim()).length;
    if (count === 0) return '—';
    return `${Math.floor(splitEvenly(this.minutes() * 60, count) / 60)} min`;
  });

  add(): void {
    this.names.update((n) => [...n, '']);
  }

  remove(index: number): void {
    this.names.update((n) => n.filter((_, i) => i !== index));
  }

  rename(index: number, value: string): void {
    this.names.update((n) => n.map((name, i) => (i === index ? value : name)));
  }

  save(): void {
    const cleaned = this.names().map((n) => n.trim()).filter(Boolean);
    if (!isValidMemberCount(cleaned.length)) {
      this.error.set(`Il faut entre ${MIN_MEMBERS} et ${MAX_MEMBERS} membres.`);
      return;
    }
    if (!this.minutes() || this.minutes() < 1) {
      this.error.set('La durée doit être d’au moins 1 minute.');
      return;
    }
    const members: Member[] = cleaned.map((name, i) => ({
      id: `${Date.now()}-${i}`,
      name,
      allocatedSec: 0,
      spokenSec: 0,
    }));
    this.session.setTeam({ name: this.teamName().trim() || 'Mon équipe', members, durationSec: this.minutes() * 60 });
    this.session.reset();
    this.router.navigateByUrl('/session');
  }
}
