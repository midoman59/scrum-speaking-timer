import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatusBannerComponent } from './features/shared/status-banner';
import { PersistenceService, UNREADABLE_DATA_MESSAGE } from './services/persistence.service';
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
}
