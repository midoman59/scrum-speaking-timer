import { Routes } from '@angular/router';
import { TeamSetupComponent } from './pages/team-setup.component';
import { SessionComponent } from './pages/session.component';
import { SummaryComponent } from './pages/summary.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'equipe' },
  { path: 'equipe', component: TeamSetupComponent, title: 'Équipe' },
  { path: 'session', component: SessionComponent, title: 'Session' },
  { path: 'bilan', component: SummaryComponent, title: 'Bilan' },
  { path: '**', redirectTo: 'equipe' },
];
