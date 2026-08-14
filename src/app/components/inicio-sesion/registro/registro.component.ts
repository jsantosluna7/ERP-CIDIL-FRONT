import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

/** Valida que "pass" y "pass2" coincidan. Se aplica a nivel de FormGroup. */
function passwordsMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const pass = control.get('pass')?.value;
  const pass2 = control.get('pass2')?.value;
  if (!pass || !pass2) return null;
  return pass === pass2 ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  /** Paso actual del wizard: 1 = cuenta, 2 = datos. */
  currentStep = 1;
  registerForm: FormGroup;

  /** Campos que pertenecen al paso 1, usados para validar antes de avanzar. */
  private readonly step1Fields = [
    'nombres',
    'apellidos',
    'email',
    'pass',
    'pass2',
  ];

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        nombres: ['', [Validators.required, Validators.minLength(2)]],
        apellidos: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        pass: ['', [Validators.required, Validators.minLength(8)]],
        pass2: ['', [Validators.required]],
        matricula: ['', [Validators.required]],
        telefono: [
          '',
          [Validators.required, Validators.pattern(/^[0-9+\-\s()]{7,15}$/)],
        ],
        direccion: ['', [Validators.required, Validators.minLength(5)]],
      },
      { validators: passwordsMatchValidator },
    );
  }

  get subText(): string {
    return this.currentStep === 1
      ? 'Crea tu cuenta.'
      : 'Cuéntanos un poco más sobre ti.';
  }

  /** Devuelve true si el campo tiene un error visible (tocado + inválido). */
  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  get passwordsMismatch(): boolean {
    const pass2 = this.registerForm.get('pass2');
    return (
      this.registerForm.hasError('passwordMismatch') &&
      !!pass2 &&
      (pass2.touched || pass2.dirty)
    );
  }

  goToStep2(): void {
    this.step1Fields.forEach((name) =>
      this.registerForm.get(name)?.markAsTouched(),
    );

    const step1Valid = this.step1Fields.every(
      (name) => this.registerForm.get(name)?.valid,
    );
    const passwordsOk = !this.registerForm.hasError('passwordMismatch');

    if (step1Valid && passwordsOk) {
      this.currentStep = 2;
    }
  }

  goToStep1(): void {
    this.currentStep = 1;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulario enviado:', this.registerForm.value);
      // Aquí va la llamada al servicio/API de registro.
    } else {
      this.registerForm.markAllAsTouched();
      if (
        this.step1Fields.some((name) => this.registerForm.get(name)?.invalid) ||
        this.registerForm.hasError('passwordMismatch')
      ) {
        this.currentStep = 1;
      }
    }
  }
}
