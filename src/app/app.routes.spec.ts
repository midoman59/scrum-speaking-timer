import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withHashLocation } from '@angular/router';
import { STORAGE } from './core/ports/storage.port';
import { provideMemoryStorage } from './testing/memory-storage';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

// S-E1-03 : routes en hash et pages provisoires.
describe('Routes en hash (S-E1-03)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withHashLocation()), provideMemoryStorage()],
    });
  });

  const cases: [string, string][] = [
    ['/equipe', 'Créer votre équipe'],
    ['/preparation', 'Préparer la session'],
    ['/session', 'Session en cours'],
    ['/bilan', 'Bilan de la session'],
  ];

  for (const [path, title] of cases) {
    it(`critère 2 : ${path} affiche le titre h1 « ${title} »`, async () => {
      const harness = await RouterTestingHarness.create(path);
      const h1 = harness.routeNativeElement!.querySelector('h1');
      expect(h1?.textContent?.trim()).toBe(title);
    });
  }

  it('critère 3 : la route vide redirige vers /equipe', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(TestBed.inject(Router).url).toBe('/equipe');
    expect(harness.routeNativeElement!.querySelector('h1')?.textContent?.trim()).toBe('Créer votre équipe');
  });

  it('S-E2-05 critère 4 : la route vide ouvre /preparation quand une équipe est en mémoire', async () => {
    TestBed.resetTestingModule();
    const memory = new Map<string, string>();
    const team = {
      id: 't1',
      name: 'Équipe Alpha',
      durationSec: 900,
      allocationMode: 'equal',
      members: [
        { id: 'm1', name: 'Camille', allocatedSec: 450 },
        { id: 'm2', name: 'Thomas', allocatedSec: 450 },
      ],
    };
    memory.set('scrum-timer:v1', JSON.stringify({ schemaVersion: 1, team, settings: { soundEnabled: true }, session: null }));
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withHashLocation()),
        {
          provide: STORAGE,
          useValue: {
            read: (key: string) => ({ ok: true, value: memory.get(key) ?? null }),
            write: () => ({ ok: true, value: undefined }),
            remove: () => ({ ok: true, value: undefined }),
          },
        },
      ],
    });
    await RouterTestingHarness.create('/');
    expect(TestBed.inject(Router).url).toBe('/preparation');
  });
});
