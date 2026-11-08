import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { STORAGE_KEY } from './core/domain/storage-schema';
import { MemoryStorage, provideMemoryStorage } from './testing/memory-storage';

// S-E2-03 critère 3 : le message FR-25 est affiché dans un bandeau au démarrage (PRD FR-25, B-2).
const UNREADABLE_TEXT =
  'Les données enregistrées sont illisibles et ont été ignorées. Vous pouvez importer un fichier de sauvegarde.';

describe('Bandeau de données illisibles (S-E2-03, C-3)', () => {
  let memory: MemoryStorage;

  beforeEach(() => {
    memory = new MemoryStorage();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMemoryStorage(memory)],
    });
  });

  it('affiche le message exact dans un bandeau quand les données sont illisibles', () => {
    memory.data.set(STORAGE_KEY, '{nouveau brut');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('app-status-banner') as HTMLElement | null;
    expect(banner).not.toBeNull();
    expect(banner!.textContent).toContain(UNREADABLE_TEXT);
  });

  it('n\'affiche aucun bandeau sans donnée illisible', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-status-banner')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain(UNREADABLE_TEXT);
  });
});
