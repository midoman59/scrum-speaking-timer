import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  booleanAttribute,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

let nextDialogId = 0;

/**
 * Boîte de confirmation modale (DESIGN.md 8.8, S-E2-04).
 * Focus initial sur le bouton non destructif, Échap = « Annuler », Tab reste dans la boîte,
 * focus rendu au déclencheur à la fermeture.
 */
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="backdrop">
      <div
        #dialog
        class="dialog"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
        [attr.aria-describedby]="messageId"
        (keydown)="onKeydown($event)"
      >
        <h2 [id]="titleId">{{ title() }}</h2>
        <p [id]="messageId">{{ message() }}</p>
        <div class="actions">
          <button #cancel type="button" class="ghost" (click)="cancelled.emit()">{{ cancelLabel() }}</button>
          <button type="button" [class.destructive]="destructive()" (click)="confirmed.emit()">
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      padding: var(--space-4);
      background: rgba(17, 24, 39, 0.6);
      z-index: 10;
    }
    .dialog {
      width: min(480px, 100%);
      display: grid;
      gap: var(--space-4);
      padding: var(--space-5);
      border-radius: var(--radius-lg);
      background: var(--color-surface);
      color: var(--color-text);
      box-shadow: var(--shadow-md);
    }
    .dialog h2 {
      margin: 0;
    }
    .dialog p {
      margin: 0;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      justify-content: flex-end;
    }
    button.destructive {
      background: var(--color-danger);
      border-color: var(--color-danger);
      color: var(--color-on-danger);
    }
    button.destructive:hover:not(:disabled) {
      background: var(--color-danger-hover);
      border-color: var(--color-danger-hover);
    }
  `,
})
export class ConfirmDialogComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly returnFocusTo = this.document.activeElement as HTMLElement | null;
  private readonly id = nextDialogId++;

  readonly titleId = `confirm-title-${this.id}`;
  readonly messageId = `confirm-message-${this.id}`;

  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input.required<string>();
  readonly cancelLabel = input('Annuler');
  readonly destructive = input(false, { transform: booleanAttribute });

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly cancelButton = viewChild.required<ElementRef<HTMLButtonElement>>('cancel');
  private readonly dialog = viewChild.required<ElementRef<HTMLElement>>('dialog');

  ngAfterViewInit(): void {
    this.cancelButton().nativeElement.focus();
  }

  ngOnDestroy(): void {
    if (this.returnFocusTo?.isConnected) this.returnFocusTo.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelled.emit();
      return;
    }
    if (event.key !== 'Tab') return;

    const root = this.dialog().nativeElement;
    const focusable = Array.from(root.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.document.activeElement;

    if (event.shiftKey && (active === first || !root.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
