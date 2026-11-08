import { Injectable, computed, inject, signal } from '@angular/core';
import { Member, SessionState, Team } from './models';
import { StorageService } from './storage.service';
import { DEFAULT_DURATION_SEC, elapsedSinceTurn, splitEvenly } from './timer.logic';

const emptySession: SessionState = {
  status: 'idle',
  startedAt: null,
  currentMemberId: null,
  turnStartedAt: null,
};

/** État de l'équipe et de la session, persisté localement. */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly storage = inject(StorageService);

  readonly team = signal<Team>(
    this.storage.load() ?? { name: 'Mon équipe', members: [], durationSec: DEFAULT_DURATION_SEC },
  );
  readonly session = signal<SessionState>({ ...emptySession });
  readonly now = signal(Date.now());

  readonly currentMember = computed<Member | null>(() => {
    const id = this.session().currentMemberId;
    return this.team().members.find((m) => m.id === id) ?? null;
  });

  readonly remainingSec = computed(() => {
    const member = this.currentMember();
    const turnStart = this.session().turnStartedAt;
    if (!member || turnStart === null) return null;
    return member.allocatedSec - member.spokenSec - elapsedSinceTurn(turnStart, this.now());
  });

  setTeam(team: Team): void {
    const members = team.members.map((m) => ({ ...m, allocatedSec: splitEvenly(team.durationSec, team.members.length) }));
    this.team.set({ ...team, members });
    this.storage.save(this.team());
  }

  /** Démarre la session et donne la parole au premier membre. */
  start(): void {
    const first = this.team().members[0];
    if (!first) return;
    const now = Date.now();
    this.now.set(now);
    this.session.set({ status: 'running', startedAt: now, currentMemberId: first.id, turnStartedAt: now });
  }

  /** Met la parole en pause : le temps parlé est crédité au membre courant. */
  pause(): void {
    this.creditCurrentTurn();
    this.session.update((s) => ({ ...s, status: 'paused', turnStartedAt: null }));
  }

  resume(): void {
    this.session.update((s) => ({ ...s, status: 'running', turnStartedAt: Date.now() }));
  }

  /** Passe la parole au membre suivant. */
  next(): void {
    this.creditCurrentTurn();
    const members = this.team().members;
    const index = members.findIndex((m) => m.id === this.session().currentMemberId);
    const following = members[index + 1];
    if (!following) {
      this.session.update((s) => ({ ...s, status: 'finished', currentMemberId: null, turnStartedAt: null }));
      return;
    }
    this.session.update((s) => ({ ...s, currentMemberId: following.id, turnStartedAt: Date.now() }));
  }

  reset(): void {
    this.session.set({ ...emptySession });
  }

  tick(): void {
    this.now.set(Date.now());
  }

  private creditCurrentTurn(): void {
    const s = this.session();
    if (!s.currentMemberId || s.turnStartedAt === null) return;
    const spent = elapsedSinceTurn(s.turnStartedAt, Date.now());
    this.team.update((t) => ({
      ...t,
      members: t.members.map((m) => (m.id === s.currentMemberId ? { ...m, spokenSec: m.spokenSec + spent } : m)),
    }));
    this.storage.save(this.team());
  }
}
