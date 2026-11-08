import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { LocalStorageAdapter } from './core/adapters/local-storage.adapter';
import { STORAGE } from './core/ports/storage.port';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // ADR-05 : stockage navigateur protégé ; les erreurs sont des résultats, jamais des exceptions.
    { provide: STORAGE, useValue: new LocalStorageAdapter(() => window.localStorage) },
    // ADR-04 : routage en mode hash, pour GitHub Pages (pas de 404 au rechargement).
    provideRouter(routes, withHashLocation()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
