import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';

/** Valida que "pass" y "pass2" coincidan. Se aplica a nivel de FormGroup. */
function passwordsMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const pass = control.get('pass')?.value;
  const pass2 = control.get('pass2')?.value;
  if (!pass || !pass2) return null;
  return pass === pass2 ? null : { passwordMismatch: true };
}

function correoInstitucionalValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  const regex = /^[a-zA-Z0-9._%+-]+@ipl\.edu\.do$/i;
  return regex.test(value) ? null : { correoInstitucional: true };
}

/** Exige el formato (809) 555-1234, ya que el input se autoformatea al escribir. */
function phoneFormatValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(value) ? null : { phoneFormat: true };
}

/** Reformatea los dígitos del teléfono como (809) 555-1234 mientras el usuario escribe. */
function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length > 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length > 3) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  if (digits.length > 0) {
    return `(${digits}`;
  }
  return digits;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent implements OnInit, OnDestroy {
  /** Paso actual del wizard: 1 = cuenta, 2 = datos. */
  currentStep = 1;
  registerForm: FormGroup;
  loading: boolean = false;

  //ENDPOINTS
  registrar = `${process.env['API_URL']}${process.env['ENDPOINT_REGISTRAR']}`;

  /** Campos que pertenecen al paso 1, usados para validar antes de avanzar. */
  private readonly step1Fields = [
    'nombres',
    'apellidos',
    'email',
    'pass',
    'pass2',
  ];

  constructor(
    private fb: FormBuilder,
    private _usuarios: UsuariosService,
    private _toastr: ToastrService,
    private _router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        nombres: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/),
          ],
        ],
        apellidos: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email, correoInstitucionalValidator],
        ],
        pass: ['', [Validators.required, Validators.minLength(8)]],
        pass2: ['', [Validators.required]],
        matricula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        telefono: ['', [Validators.required, phoneFormatValidator]],
        direccion: ['', [Validators.required, Validators.minLength(5)]],
      },
      { validators: passwordsMatchValidator },
    );
  }

  ngOnInit(): void {
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('no-scroll');
    document.documentElement.classList.remove('no-scroll');
  }

  get subText(): string {
    return this.currentStep === 1
      ? 'Crea tu cuenta.'
      : 'Cuéntanos un poco más sobre ti.';
  }

  /** Devuelve true si el campo tiene un error visible (tocado + inválido). */
  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  get passwordsMismatch(): boolean {
    const pass2 = this.registerForm.get('pass2');
    return (
      this.registerForm.hasError('passwordMismatch') &&
      !!pass2 &&
      (pass2.touched || pass2.dirty)
    );
  }

  /**
   * Igual que hasError(), pero para 'pass2' también considera el error de
   * FormGroup (passwordMismatch), que no vive dentro del propio control.
   */
  fieldHasError(controlName: string): boolean {
    if (controlName === 'pass2') {
      return this.hasError('pass2') || this.passwordsMismatch;
    }
    return this.hasError(controlName);
  }

  /** Mensaje de error a mostrar en el tooltip del ícono "i". */
  errorMessage(controlName: string): string {
    if (controlName === 'pass2' && this.passwordsMismatch) {
      return 'Las contraseñas no coinciden.';
    }

    const control = this.registerForm.get(controlName);
    if (!control || !control.errors) return '';

    switch (controlName) {
      case 'nombres':
        return 'Ingresa tu nombre.';
      case 'apellidos':
        return 'Ingresa tus apellidos.';
      case 'email':
        if (control.hasError('required')) return 'El correo es obligatorio.';
        if (control.hasError('email')) return 'Formato de correo inválido.';
        if (control.hasError('correoInstitucional'))
          return 'Debes usar tu correo institucional (@ipl.edu.do).';
        return 'Correo inválido.';
      case 'pass':
        return 'Mínimo 8 caracteres.';
      case 'matricula':
        return 'Ingresa tu matrícula o ID.';
      case 'telefono':
        if (control.hasError('required'))
          return 'Ingresa tu número de teléfono.';
        if (control.hasError('phoneFormat'))
          return 'Formato esperado: (809) 555-1234.';
        return 'Teléfono inválido.';
      case 'direccion':
        return 'Ingresa tu dirección.';
      default:
        return 'Campo inválido.';
    }
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

  /** Elimina cualquier carácter que no sea letra o espacio mientras se escribe. */
  onSoloTextoInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const limpio = input.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, '');
    this.registerForm.get(controlName)?.setValue(limpio);
  }

  /** Elimina cualquier carácter que no sea dígito mientras se escribe. */
  onSoloNumeroInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const limpio = input.value.replace(/\D/g, '');
    this.registerForm.get(controlName)?.setValue(limpio);
  }

  /** Autoformatea el teléfono como (809) 555-1234 mientras el usuario escribe. */
  onTelefonoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatPhoneInput(input.value);
    this.registerForm
      .get('telefono')
      ?.setValue(formatted, { emitEvent: false });
  }

  /** Enter en el paso 1 avanza al paso 2 en vez de enviar el formulario. */
  onEnterKey(event: Event): void {
    if (this.currentStep === 1) {
      event.preventDefault();
      this.goToStep2();
    }
    // En el paso 2 no hacemos nada: el comportamiento nativo del <form>
    // ya dispara (ngSubmit) porque el botón type="submit" está presente.
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;

      const formValue = this.registerForm.value;

      const data = {
        idMatricula: formValue.matricula,
        nombreUsuario: formValue.nombres,
        apellidoUsuario: formValue.apellidos,
        correoInstitucional: formValue.email,
        contrasenaHash: formValue.pass2,
        telefono: formValue.telefono.replace(/\D/g, ''), // 8097777777
        direccion: formValue.direccion,
      };

      this._usuarios.registro(this.registrar, data).subscribe({
        next: (e) => {
          this.loading = false;
          this._router.navigate(['acceso/verificacion-otp']);
        },
        error: (e) => {
          this.loading = false;
          this._toastr.error(e.error.error, 'Hubo un error');
        },
      });

      console.log('Formulario enviado:', data);
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
