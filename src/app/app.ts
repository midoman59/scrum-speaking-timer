import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatusBannerComponent } from './features/shared/status-banner';
import {
  BACKUP_LOST_MESSAGE,
  PersistenceService,
  STORAGE_REFUSED_MESSAGE,
  UNREADABLE_DATA_MESSAGE,
} from './services/persistence.service';
import { TeamService } from './services/team.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StatusBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Injecté ici pour charger la persistance au démarrage, quelle que soit la route (ADR-05).
  private readonly teams = inject(TeamService);
  private readonly persistence = inject(PersistenceService);

  readonly unreadableMessage = UNREADABLE_DATA_MESSAGE;
  readonly unreadableDismissed = signal(false);
  readonly showUnreadable = computed(
    () => this.persistence.dataIssue() === 'unreadable' && !this.unreadableDismissed(),
  );

  readonly backupLostMessage = BACKUP_LOST_MESSAGE;
  readonly backupLostDismissed = signal(false);
  /** N-3 : une sauvegarde a été remplacée faute d'emplacement, la perte est signalée. */
  readonly showBackupLost = computed(
    () => this.persistence.backupLost() && !this.backupLostDismissed(),
  );

  readonly storageRefusedMessage = STORAGE_REFUSED_MESSAGE;
  readonly storageRefusedDismissed = signal(false);
  /** Bandeau B-1 : tant que le stockage n'est pas sain, la Session continue en mémoire vive (FR-25). */
  readonly showStorageRefused = computed(
    () => this.persistence.health() !== 'ok' && !this.storageRefusedDismissed(),
  );
}
