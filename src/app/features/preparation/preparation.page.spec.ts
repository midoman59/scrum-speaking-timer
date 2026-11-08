import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withHashLocation } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { TeamService } from '../../services/team.service';
import { MemoryStorage, provideMemoryStorage } from '../../testing/memory-storage';
import { sampleTeam, seedTeam } from '../../testing/fixtures';

// S-E2-12 : écran de préparation et garde de la route (FR-6, FR-10).
describe('Écran de préparation (S-E2-12)', () => {
  let memory: MemoryStorage;

  beforeEach(() => {
    memory = new MemoryStorage();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withHashLocation()), provideMemoryStorage(memory)],
    });
  });

  function text(harness: RouterTestingHarness, selector: string): string {
    return harness.routeNativeElement!.querySelector(selector)?.textContent?.trim() ?? '';
  }

  it('critère 1 : titre, nom, durée, liste ordonnée avec position, prénom et temps alloué en mm:ss', async () => {
    seedTeam(memory);
    const harness = await RouterTestingHarness.create('/preparation');
    expect(text(harness, 'h1')).toBe('Préparer la session');
    expect(text(harness, 'h2')).toBe('Équipe Alpha');
    expect(harness.routeNativeElement!.textContent).toContain('15 min');

    const rows = Array.from(harness.routeNativeElement!.querySelectorAll('.member-list li')).map((li) =>
      Array.from(li.querySelectorAll('span'))
        .map((span) => span.textContent?.trim())
        .join(' '),
    );
    expect(rows).toEqual(['1 Camille 07:30', '2 Thomas 07:30']);
  });

  it('critère 2 : sans équipe, la garde redirige vers /equipe', async () => {
    await RouterTestingHarness.create('/preparation');
    expect(TestBed.inject(Router).url).toBe('/equipe');
  });

  it('S-E2-06 critère 4 : un point d\'entrée « Nouvelle équipe » mène à l\'écran Équipe', async () => {
    seedTeam(memory);
    const harness = await RouterTestingHarness.create('/preparation');
    const link = Array.from(harness.routeNativeElement!.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === 'Nouvelle équipe',
    );
    expect(link?.getAttribute('href')).toBe('#/equipe');
  });

  it('critère 3 : équipe invalide, bouton désactivé et motif affiché sous le bouton', async () => {
    seedTeam(memory);
    const service = TestBed.inject(TeamService);
    const harness = await RouterTestingHarness.create('/preparation');
    service.team.set({ ...sampleTeam(), members: [{ id: 'm1', name: 'Seul', allocatedSec: 900 }] });
    harness.fixture.detectChanges();

    const start = Array.from(harness.routeNativeElement!.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Démarrer la session'),
    ) as HTMLButtonElement;
    expect(start.disabled).toBeTrue();
    expect(harness.routeNativeElement!.textContent).toContain(
      'Ajoutez au moins 2 membres pour lancer une session.',
    );
  });

  it('critère 3 : le motif est placé sous le bouton, dans l\'ordre du document', async () => {
    seedTeam(memory);
    const service = TestBed.inject(TeamService);
    const harness = await RouterTestingHarness.create('/preparation');
    service.team.set({ ...sampleTeam(), members: [{ id: 'm1', name: 'Seul', allocatedSec: 900 }] });
    harness.fixture.detectChanges();

    const root = harness.routeNativeElement!;
    const start = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Démarrer la session'),
    ) as HTMLButtonElement;
    const actions = root.querySelector('.actions') as HTMLElement;
    const help = root.querySelector('#start-help') as HTMLElement;

    expect(help).not.toBeNull();
    expect(actions.contains(start)).toBeTrue();
    // Le motif suit le conteneur du bouton : il est affiché sous lui, et l'annonce vient après le bouton.
    expect(actions.compareDocumentPosition(help) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(help.compareDocumentPosition(start) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });
});
