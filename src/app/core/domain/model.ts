// Modèle du domaine (architecture 3.1). Montants en secondes, entiers.

export type AllocationMode = 'equal' | 'manual';

/** Membre de l'équipe. Son temps alloué couvre toute la Session (D2). */
export interface Member {
  readonly id: string;
  readonly name: string;
  readonly allocatedSec: number;
}

/** Équipe persistée. Invariants : architecture 3.2. */
export interface Team {
  readonly id: string;
  readonly name: string;
  readonly durationSec: number;
  readonly allocationMode: AllocationMode;
  readonly members: readonly Member[];
}

/** Brouillon d'édition : peut être invalide. Jamais persisté tel quel. */
export interface TeamDraft {
  readonly name: string;
  readonly durationSec: number;
  readonly allocationMode: AllocationMode;
  readonly members: readonly Member[];
}
