import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withHashLocation } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Result, ok } from '../../core/domain/result';
import { STORAGE, StoragePort, StorageError } from '../../core/ports/storage.port';
import { STORAGE_KEY } from '../../core/domain/storage-schema';
import { routes } from '../../app.routes';
import { MemoryStorage, provideMemoryStorage } from '../../testing/memory-storage';

// S-E2-05 : écran Équipe (création), critères 1, 2, 3 et 5.
describe('Écran Équipe, création (S-E2-05)', () => {
  let memory: MemoryStorage;

  beforeEach(() => {
    memory = new MemoryStorage();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withHashLocation()), provideMemoryStorage(memory)],
    });
  });

  async function openEditor(): Promise<RouterTestingHarness> {
    return RouterTestingHarness.create('/equipe');
  }

  function el<T extends HTMLElement>(harness: RouterTestingHarness, selector: string): T {
    return harness.routeNativeElement!.querySelector(selector) as T;
  }

  function type(harness: RouterTestingHarness, selector: string, value: string): void {
    const input = el<HTMLInputElement>(harness, selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    harness.fixture.detectChanges();
  }

  function pressEnter(harness: RouterTestingHarness, selector: string): void {
    const input = el<HTMLInputElement>(harness, selector);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    harness.fixture.detectChanges();
  }

  function saveButton(harness: RouterTestingHarness): HTMLButtonElement {
    return Array.from(harness.routeNativeElement!.querySelectorAll('button')).find((b) =>
      b.textContent?.includes("Enregistrer l'équipe"),
    ) as HTMLButtonElement;
  }

  it('critère 1 : titre, nom vide, durée à 15, liste vide, bouton désactivé', async () => {
    const harness = await openEditor();
    expect(el(harness, 'h1')?.textContent?.trim()).toBe('Créer votre équipe');
    expect(el<HTMLInputElement>(harness, '#duration').value).toBe('15');
    expect(el<HTMLInputElement>(harness, '#team-name').value).toBe('');
    expect(harness.routeNativeElement!.querySelectorAll('.member-list li').length).toBe(0);
    expect(saveButton(harness).disabled).toBeTrue();
  });

  it('critère 3 : un seul Membre, bouton désactivé et message affiché', async () => {
    const harness = await openEditor();
    type(harness, '#team-name', 'Équipe Alpha');
    type(harness, '#member-name', 'Camille');
    pressEnter(harness, '#member-name');
    expect(saveButton(harness).disabled).toBeTrue();
    expect(harness.routeNativeElement!.textContent).toContain('Ajoutez au moins 2 membres pour lancer une session.');
  });

  it('critère 2 : enregistrement avec deux Membres, persistance et passage à /preparation', async () => {
    const harness = await openEditor();
    type(harness, '#team-name', 'Équipe Alpha');
    type(harness, '#member-name', 'Camille');
    pressEnter(harness, '#member-name');
    type(harness, '#member-name', 'Thomas');
    pressEnter(harness, '#member-name');

    expect(saveButton(harness).disabled).toBeFalse();
    saveButton(harness).click();
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/preparation');
    const stored = JSON.parse(memory.data.get(STORAGE_KEY) ?? '{}');
    expect(stored.team.allocationMode).toBe('equal');
    expect(stored.team.members.map((m: { allocatedSec: number }) => m.allocatedSec)).toEqual([450, 450]);
  });

  it('S-E2-07 critère 1 : au 15e Membre, champ et « Ajouter » désactivés avec le message de limite', async () => {
    const harness = await openEditor();
    for (let i = 0; i < 15; i++) {
      const name = `Ma${String.fromCharCode(65 + i)}`.replace(/[^A-Za-z]/g, 'x');
      type(harness, '#member-name', name);
      pressEnter(harness, '#member-name');
    }
    expect(el<HTMLInputElement>(harness, '#member-name').disabled).toBeTrue();
    const add = Array.from(harness.routeNativeElement!.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Ajouter',
    ) as HTMLButtonElement;
    expect(add.disabled).toBeTrue();
    expect(harness.routeNativeElement!.textContent).toContain('Une équipe ne peut pas dépasser 15 membres.');
  });

  it('S-E2-07 critère 2 : prénom invalide, erreur liée par aria-describedby, prénom gardé, membre non ajouté', async () => {
    const harness = await openEditor();
    type(harness, '#member-name', 'Jean3');
    pressEnter(harness, '#member-name');

    const input = el<HTMLInputElement>(harness, '#member-name');
    expect(input.getAttribute('aria-describedby')).toBe('member-name-error');
    expect(el(harness, '#member-name-error')?.textContent).toContain(
      'Un prénom ne peut contenir que des lettres, espaces, traits d\'union et apostrophes.',
    );
    expect(input.value).toBe('Jean3');
    expect(harness.routeNativeElement!.querySelectorAll('.member-list li').length).toBe(0);
  });

  it('S-E2-07 critère 3 : après une erreur d\'ajout, le champ reçoit le focus', async () => {
    const harness = await openEditor();
    type(harness, '#member-name', '');
    el<HTMLButtonElement>(harness, '#team-name').focus();
    const add = Array.from(harness.routeNativeElement!.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Ajouter',
    ) as HTMLButtonElement;
    add.click();
    harness.fixture.detectChanges();
    expect(document.activeElement).toBe(el(harness, '#member-name'));
  });

  it('critère 5 : Entrée dans le champ d\'ajout ajoute le Membre en fin de liste et garde le focus', async () => {
    const harness = await openEditor();
    type(harness, '#member-name', 'Camille');
    pressEnter(harness, '#member-name');
    type(harness, '#member-name', 'Thomas');
    pressEnter(harness, '#member-name');

    const items = Array.from(harness.routeNativeElement!.querySelectorAll('.member-list li')).map((li) =>
      li.textContent?.trim(),
    );
    expect(items.some((text) => text?.includes('Thomas'))).toBeTrue();
    expect(items[items.length - 1]).toContain('Thomas');
    expect(document.activeElement).toBe(el(harness, '#member-name'));
  });
});
