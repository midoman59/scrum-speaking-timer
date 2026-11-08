import { Injectable } from '@angular/core';
import { Team } from './models';

const STORAGE_KEY = 'scrum-timer:v1';

/** Persistance locale. Chaque accès est protégé : le stockage peut être indisponible. */
@Injectable({ providedIn: 'root' })
export class StorageService {
  load(): Team | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Team) : null;
    } catch {
      return null;
    }
  }

  save(team: Team): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    } catch {
      // Stockage indisponible (navigation privée, quota) : l'app reste utilisable.
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Rien à faire.
    }
  }

  /** Export JSON, pour sauvegarder l'équipe sans serveur. */
  exportJson(team: Team): string {
    return JSON.stringify(team, null, 2);
  }

  importJson(json: string): Team | null {
    try {
      const parsed = JSON.parse(json) as Team;
      return Array.isArray(parsed.members) ? parsed : null;
    } catch {
      return null;
    }
  }
}
