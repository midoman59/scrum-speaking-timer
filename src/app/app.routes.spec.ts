import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withHashLocation } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

// S-E1-03 : routes en hash et pages provisoires.
describe('Routes en hash (S-E1-03)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes, withHashLocation())] });
  });

  const cases: [string, string][] = [
    ['/equipe', 'Équipe'],
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
    expect(harness.routeNativeElement!.querySelector('h1')?.textContent?.trim()).toBe('Équipe');
  });
});
