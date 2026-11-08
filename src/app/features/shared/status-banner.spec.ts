import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBannerComponent } from './status-banner';

@Component({
  imports: [StatusBannerComponent],
  template: `
    <app-status-banner [variant]="variant" (dismissed)="dismissed = true">Message de test</app-status-banner>
  `,
})
class HostComponent {
  variant: 'info' | 'warning' | 'error' | 'success' = 'warning';
  dismissed = false;
}

// S-E2-04 critère 4 : rôle ARIA selon la gravité et bandeau fermable.
describe('StatusBannerComponent (S-E2-04)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  function banner(): HTMLElement {
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.banner') as HTMLElement;
  }

  it('avertissement et information : role="status"', () => {
    host.variant = 'warning';
    expect(banner().getAttribute('role')).toBe('status');
    host.variant = 'info';
    expect(banner().getAttribute('role')).toBe('status');
    host.variant = 'success';
    expect(banner().getAttribute('role')).toBe('status');
  });

  it('erreur : role="alert"', () => {
    host.variant = 'error';
    expect(banner().getAttribute('role')).toBe('alert');
  });

  it('le bandeau est fermable par un bouton nommé « Fermer le message »', () => {
    banner();
    const close = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Fermer le message');
    close.click();
    expect(host.dismissed).toBeTrue();
  });

  it('affiche son contenu', () => {
    expect(banner().textContent).toContain('Message de test');
  });
});
