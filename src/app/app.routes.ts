import { Routes } from '@angular/router';
import { TeamEditorPage } from './features/team-editor/team-editor.page';
import { PreparationPage } from './features/preparation/preparation.page';
import { SessionPage } from './features/session/session.page';
import { SummaryPage } from './features/summary/summary.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'equipe' },
  { path: 'equipe', component: TeamEditorPage, title: 'Équipe' },
  { path: 'preparation', component: PreparationPage, title: 'Préparer la session' },
  { path: 'session', component: SessionPage, title: 'Session' },
  { path: 'bilan', component: SummaryPage, title: 'Bilan' },
  { path: '**', redirectTo: 'equipe' },
];
