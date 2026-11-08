import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog';

// Hôte qui ouvre la boîte comme le ferait une page : la boîte n'existe que quand elle est affichée.
@Component({
  imports: [ConfirmDialogComponent],
  template: `
    <button id="trigger" type="button">Ouvrir</button>
    @if (open) {
      <app-confirm-dialog
        title="Remplacer l'équipe existante ?"
        message="Cette action supprime l'équipe actuelle et son réglage."
        confirmLabel="Remplacer"
        destructive
        (confirmed)="confirmed = true"
        (cancelled)="cancelled = true"
      />
    }
  `,
})
class HostComponent {
  open = false;
  confirmed = false;
  cancelled = false;
}

// S-E2-04 critères 1 à 3 : focus initial, Échap, piège de focus et retour du focus.
describe('ConfirmDialogComponent (S-E2-04)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function openDialog(): HTMLElement {
    host.open = true;
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
  }

  it('critère 1 : le focus va sur le bouton non destructif à l\'ouverture', () => {
    openDialog();
    expect(document.activeElement?.textContent?.trim()).toBe('Annuler');
  });

  it('critère 2 : Échap se comporte comme « Annuler »', () => {
    const dialog = openDialog();
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(host.cancelled).toBeTrue();
    expect(host.confirmed).toBeFalse();
  });

  it('critère 3 : Tab reste dans la boîte ; à la fermeture le focus revient au déclencheur', () => {
    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.focus();

    const dialog = openDialog();
    const [cancel, confirm] = Array.from(dialog.querySelectorAll('button')) as HTMLButtonElement[];

    confirm.focus();
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(cancel);

    cancel.focus();
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    expect(document.activeElement).toBe(confirm);

    host.open = false;
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger);
  });
});
