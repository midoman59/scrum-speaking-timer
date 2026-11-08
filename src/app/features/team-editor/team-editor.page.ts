import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationError } from '../../core/domain/errors';
import { Member } from '../../core/domain/model';
import { addMemberToDraft, MAX_MEMBERS } from '../../core/domain/draft';
import { messageFor } from '../../core/domain/messages';
import {
  validateDurationForMembers,
  validateDurationMinutes,
  validateMemberName,
  validateTeamName,
} from '../../core/domain/validation';
import { newId } from '../../services/ids';
import { TeamService } from '../../services/team.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog';

const MIN_MEMBERS = 2;

/** Écran Équipe, création (E-1, S-E2-05). Formulaire réactif, un validateur par champ (ADR-07). */
@Component({
  selector: 'app-team-editor-page',
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  template: `
    <section class="page">
      <h1>Créer votre équipe</h1>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <div class="field">
          <label for="team-name">Nom d'équipe</label>
          <input
            id="team-name"
            type="text"
            formControlName="name"
            autocomplete="off"
            [attr.aria-invalid]="showError('name') ? 'true' : null"
            [attr.aria-describedby]="showError('name') ? 'team-name-error' : null"
          />
          @if (showError('name')) {
            <p id="team-name-error" class="error">{{ errorText('name') }}</p>
          }
        </div>

        <div class="field">
          <label for="duration">Durée de cérémonie (minutes)</label>
          <input
            id="duration"
            type="text"
            inputmode="numeric"
            formControlName="duration"
            [attr.aria-invalid]="showError('duration') ? 'true' : null"
            [attr.aria-describedby]="showError('duration') ? 'duration-error' : null"
          />
          @if (showError('duration')) {
            <p id="duration-error" class="error">{{ errorText('duration') }}</p>
          }
        </div>

        <h2>Membres ({{ members().length }})</h2>
        <ol class="member-list">
          @for (member of members(); track member.id; let i = $index) {
            <li>
              <span class="position">{{ i + 1 }}</span>
              <span class="name">{{ member.name }}</span>
            </li>
          }
        </ol>
        @if (atLimit()) {
          <p id="limit-error" class="error">{{ limitText }}</p>
        }

        <div class="field">
          <label for="member-name">Prénom du membre</label>
          <div class="row">
            <input
              id="member-name"
              type="text"
              formControlName="member"
              autocomplete="off"
              (keydown.enter)="$event.preventDefault(); addMember()"
              [attr.aria-invalid]="showError('member') ? 'true' : null"
              [attr.aria-describedby]="showError('member') ? 'member-name-error' : null"
            />
            <button type="button" class="ghost" [disabled]="atLimit()" (click)="addMember()">Ajouter</button>
          </div>
          @if (showError('member')) {
            <p id="member-name-error" class="error">{{ errorText('member') }}</p>
          }
        </div>

        @if (!canSave()) {
          <p id="submit-help" class="help" role="status">{{ submitHelp() }}</p>
        }

        <div class="actions">
          <button
            type="submit"
            [disabled]="!canSave()"
            [attr.aria-describedby]="canSave() ? null : 'submit-help'"
          >
            Enregistrer l'équipe
          </button>
        </div>

        @for (text of saveErrors(); track $index) {
          <p class="error" role="alert">{{ text }}</p>
        }
      </form>

      @if (replaceOpen()) {
        <app-confirm-dialog
          title="Remplacer l'équipe existante ?"
          message="Cette action supprime l'équipe actuelle et son réglage."
          confirmLabel="Remplacer"
          destructive
          (confirmed)="replaceOpen.set(false); save()"
          (cancelled)="replaceOpen.set(false)"
        />
      }
    </section>
  `,
  styles: `
    .page { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-4); max-width: 560px; }
    .field { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-2); }
    label { font-weight: 600; font-size: var(--text-sm); }
    input {
      min-height: var(--target-min);
      padding: var(--space-2) var(--space-3);
      font: inherit;
      color: var(--color-text);
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }
    input[aria-invalid='true'] { border: 2px solid var(--color-danger); }
    .row { display: flex; gap: var(--space-2); }
    .row input { flex: 1; min-width: 0; }
    .member-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); }
    .member-list li {
      display: flex;
      gap: var(--space-3);
      align-items: center;
      min-height: var(--target-min);
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    .position { color: var(--color-text-muted); font-size: var(--text-xs); min-width: 1.5em; }
    .error { margin: 0; color: var(--color-danger); font-size: var(--text-sm); font-weight: 600; }
    .help { margin: 0; color: var(--color-text-muted); font-size: var(--text-sm); }
    .actions { display: flex; justify-content: flex-end; }
  `,
})
export class TeamEditorPage {
  private readonly teams = inject(TeamService);
  private readonly router = inject(Router);

  readonly limitText = messageFor('MEMBER_COUNT_MAX');

  readonly members = signal<Member[]>([]);
  readonly atLimit = computed(() => this.members().length >= MAX_MEMBERS);
  readonly submitted = signal(false);
  readonly saveErrors = signal<string[]>([]);
  readonly replaceOpen = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [(control) => this.firstError(validateTeamName(control.value))],
    }),
    duration: new FormControl('15', {
      nonNullable: true,
      validators: [(control) => this.durationError(control.value)],
    }),
    member: new FormControl('', {
      nonNullable: true,
      validators: [(control) => this.firstError(validateMemberName(control.value, this.members()))],
    }),
  });

  canSave(): boolean {
    return (
      this.form.controls.name.valid &&
      this.form.controls.duration.valid &&
      this.members().length >= MIN_MEMBERS
    );
  }

  /** Première condition manquante, affichée sous le bouton désactivé (ADR-07). */
  submitHelp(): string {
    if (!this.form.controls.name.valid) return this.errorText('name');
    if (!this.form.controls.duration.valid) return this.errorText('duration');
    if (this.members().length < MIN_MEMBERS) return messageFor('MEMBER_COUNT_MIN');
    return '';
  }

  showError(field: 'name' | 'duration' | 'member'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  errorText(field: 'name' | 'duration' | 'member'): string {
    const code = this.form.controls[field].errors?.['domain'] as ValidationError['code'] | undefined;
    return code ? messageFor(code, { count: this.members().length }) : '';
  }

  /** Ajoute le prénom saisi. Renvoie false si le prénom est refusé (erreur affichée, focus sur le champ). */
  addMember(): boolean {
    const control = this.form.controls.member;
    control.markAsTouched();
    const result = addMemberToDraft(
      {
        name: this.form.controls.name.value,
        durationSec: 900,
        allocationMode: 'equal',
        members: this.members(),
      },
      control.value,
      newId(),
    );
    if (!result.ok) {
      this.focusField('member-name');
      return false;
    }
    this.members.set([...result.value.members]);
    this.syncMemberLimit();
    control.setValue('');
    control.markAsUntouched();
    this.form.controls.duration.updateValueAndValidity();
    this.focusField('member-name');
    return true;
  }

  /** Au 15e Membre, la saisie est désactivée (S-E2-07). */
  private syncMemberLimit(): void {
    if (this.atLimit()) {
      this.form.controls.member.disable({ emitEvent: false });
    } else {
      this.form.controls.member.enable({ emitEvent: false });
    }
  }

  onSubmit(): void {
    this.submitted.set(true);
    // I-5 : un prénom saisi mais non ajouté n'est pas perdu : il est ajouté, ou bloque l'enregistrement.
    if (this.form.controls.member.value.trim() !== '' && !this.addMember()) return;
    if (!this.canSave()) {
      this.focusFirstInvalid();
      return;
    }
    // S-E2-06 : une équipe existante n'est remplacée qu'après confirmation (D-1).
    if (this.teams.hasTeam()) {
      this.replaceOpen.set(true);
      return;
    }
    this.save();
  }

  save(): void {
    const duration = validateDurationMinutes(this.form.controls.duration.value);
    if (!duration.ok) return;

    const result = this.teams.commit({
      name: this.form.controls.name.value,
      durationSec: duration.value,
      allocationMode: 'equal',
      members: this.members(),
    });
    if (result.ok) {
      void this.router.navigateByUrl('/preparation');
      return;
    }
    this.saveErrors.set(result.error.map((e) => messageFor(e.code, { count: this.members().length })));
  }

  private firstError(errors: ValidationError[]): ValidationErrors | null {
    return errors.length > 0 ? { domain: errors[0].code } : null;
  }

  private durationError(raw: string): ValidationErrors | null {
    const duration = validateDurationMinutes(raw);
    if (!duration.ok) return { domain: duration.error.code };
    const perMember = validateDurationForMembers(duration.value, this.members().length);
    return perMember.length > 0 ? { domain: perMember[0].code } : null;
  }

  private focusFirstInvalid(): void {
    const order: [keyof typeof this.form.controls, string][] = [
      ['name', 'team-name'],
      ['duration', 'duration'],
    ];
    const first = order.find(([field]) => this.form.controls[field].invalid);
    this.focusField(first ? first[1] : 'member-name');
  }

  private focusField(id: string): void {
    document.getElementById(id)?.focus();
  }
}
