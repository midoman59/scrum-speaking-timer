export interface Member {
  id: string;
  name: string;
  allocatedSec: number;
  spokenSec: number;
}

export interface Team {
  name: string;
  members: Member[];
  durationSec: number;
}

export type SessionStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface SessionState {
  status: SessionStatus;
  startedAt: number | null;
  currentMemberId: string | null;
  turnStartedAt: number | null;
}
