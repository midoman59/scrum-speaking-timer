import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { err } from './core/domain/result';
import { STORAGE_KEY } from './core/domain/storage-schema';
import { TeamDraft } from './core/domain/model';
import { TeamService } from './services/team.service';
import { MemoryStorage, provideMemoryStorage } from './testing/memory-storage';

// S-E2-03 critère 3 : le message FR-25 est affiché dans un bandeau au démarrage (PRD FR-25, B-2).
const UNREADABLE_TEXT =
  'Les données enregistrées sont illisibles et ont été ignorées. Vous pouvez importer un fichier de sauvegarde.';

// PRD FR-25 et EXPERIENCE.md B-1 : stockage refusé ou quota dépassé.
const STORAGE_REFUSED_TEXT =
  'Vos données ne seront pas conservées après fermeture. Exportez votre équipe pour la sauvegarder.';

const VALID_DRAFT: TeamDraft = {
  name: 'Équipe Alpha',
  durationSec: 900,
  allocationMode: 'equal',
  members: [
    { id: 'tmp-1', name: 'Camille', allocatedSec: 0 },
    { id: 'tmp-2', name: 'Thomas', allocatedSec: 0 },
  ],
};

describe('Bandeau de stockage refusé (FR-25, B-1, N-1)', () => {
  let memory: MemoryStorage;

  beforeEach(() => {
    memory = new MemoryStorage();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMemoryStorage(memory)],
    });
  });

  it('affiche le bandeau B-1 avec le texte exact quand l\'écriture échoue (quota)', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    memory.write = () => err('STORAGE_QUOTA');

    const result = TestBed.inject(TeamService).commit(VALID_DRAFT);
    fixture.detectChanges();

    expect(result.ok).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain(STORAGE_REFUSED_TEXT);
  });

  it('affiche le bandeau B-1 quand le stockage est indisponible', () => {
    memory.write = () => err('STORAGE_UNAVAILABLE');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    TestBed.inject(TeamService).commit(VALID_DRAFT);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(STORAGE_REFUSED_TEXT);
  });

  it('n\'affiche pas le bandeau B-1 quand l\'écriture réussit', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    TestBed.inject(TeamService).commit(VALID_DRAFT);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain(STORAGE_REFUSED_TEXT);
  });
});

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
