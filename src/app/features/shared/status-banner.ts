import { Component, computed, input, output } from '@angular/core';

export type BannerVariant = 'info' | 'warning' | 'error' | 'success';

/**
 * Bandeau d'état fermable (DESIGN.md 8.6, S-E2-04).
 * Erreur : role="alert". Information, avertissement, succès : role="status".
 */
@Component({
  selector: 'app-status-banner',
  template: `
    <div class="banner" [class]="variant()" [attr.role]="role()">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        @switch (variant()) {
          @case ('success') {
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          }
          @case ('info') {
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6M12 7.5v.5" />
          }
          @default {
            <path d="M12 3.5L21.5 20h-19z" />
            <path d="M12 10v4.5M12 17v.5" />
          }
        }
      </svg>
      <div class="content"><ng-content /></div>
      <button type="button" class="close" aria-label="Fermer le message" (click)="dismissed.emit()">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  `,
  styles: `
    .banner {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-left: 4px solid currentColor;
      border-radius: var(--radius-md);
      background: var(--banner-bg);
      color: var(--banner-fg);
    }
    .banner.info {
      --banner-bg: var(--color-primary-soft);
      --banner-fg: var(--color-on-primary-soft);
    }
    .banner.warning {
      --banner-bg: var(--color-warning-soft);
      --banner-fg: var(--color-warning);
    }
    .banner.error {
      --banner-bg: var(--color-danger-soft);
      --banner-fg: var(--color-danger);
    }
    .banner.success {
      --banner-bg: var(--color-success-soft);
      --banner-fg: var(--color-success);
    }
    svg {
      width: 24px;
      height: 24px;
      flex: none;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .content {
      flex: 1;
      color: inherit;
    }
    .close {
      min-width: var(--target-min);
      min-height: var(--target-min);
      padding: 0;
      border: none;
      background: transparent;
      color: inherit;
    }
    .close svg {
      width: 20px;
      height: 20px;
    }
  `,
})
export class StatusBannerComponent {
  readonly variant = input<BannerVariant>('info');
  readonly dismissed = output<void>();
  readonly role = computed(() => (this.variant() === 'error' ? 'alert' : 'status'));
}
