import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TeamService } from './services/team.service';

/** La préparation exige une équipe, sinon retour à la création (S-E2-12). */
export const teamRequiredGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(TeamService).hasTeam() ? true : router.createUrlTree(['/equipe']);
};

/** La racine ouvre la préparation si une équipe est en mémoire, sinon la création (FR-6). */
export const homeGuard: CanActivateFn = () => {
  const router = inject(Router);
  return router.createUrlTree([inject(TeamService).hasTeam() ? '/preparation' : '/equipe']);
};
