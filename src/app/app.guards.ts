import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TeamService } from './services/team.service';

/** La racine ouvre la préparation si une équipe est en mémoire, sinon la création (FR-6). */
export const homeGuard: CanActivateFn = () => {
  const router = inject(Router);
  return router.createUrlTree([inject(TeamService).hasTeam() ? '/preparation' : '/equipe']);
};
