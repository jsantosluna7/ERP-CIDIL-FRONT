import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Validador a nivel de FormGroup: si "password" y "confirmPassword" no coinciden,
 * marca el error `passwordMismatch` directamente sobre el control confirmPassword.
 */
function passwordsMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword');

    if (!confirmPassword) return null;

    if (confirmPassword.value && password !== confirmPassword.value) {
      confirmPassword.setErrors({
        ...confirmPassword.errors,
        passwordMismatch: true,
      });
    } else if (confirmPassword.hasError('passwordMismatch')) {
      const { passwordMismatch, ...rest } = confirmPassword.errors ?? {};
      confirmPassword.setErrors(Object.keys(rest).length ? rest : null);
    }

    return null;
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css',
})
export class CambiarContrasenaComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  token: string = '';

  restablecerContrasena = `${process.env['API_URL']}${process.env['ENDPOINT_RESTABLECER_CONTRASENA']}`;

  private readonly errorMessages: Record<string, Record<string, string>> = {
    password: {
      required: 'La contraseña es obligatoria.',
      minlength: 'Debe tener al menos 8 caracteres.',
    },
    confirmPassword: {
      required: 'Confirma la contraseña.',
      passwordMismatch: 'Las contraseñas no coinciden.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private _usuarios: UsuariosService,
    private _toastr: ToastrService,
    private _router: Router,
    private _token: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordsMatchValidator() },
    );

    this._token.queryParams.subscribe((params) => {
      const token = params['token'];
      this.token = token;
    });
  }

  /** true si el control tiene un error visible (tocado o modificado + inválido). */
  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Mensaje de error correspondiente al primer validador que falló para ese control. */
  errorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';
    const firstErrorKey = Object.keys(control.errors)[0];
    return (
      this.errorMessages[controlName]?.[firstErrorKey] ?? 'Campo inválido.'
    );
  }

  onSubmit(): void {
    this.loading = true;

    if (this.form.invalid) {
      this.loading = false;
      this.form.markAllAsTouched();
      return;
    }

    const { confirmPassword } = this.form.value;

    const data = {
      token: this.token,
      nuevaContrasena: confirmPassword,
    };

    this._usuarios
      .restablecerContrasena(this.restablecerContrasena, data)
      .subscribe({
        next: (e) => {
          this.loading = false;
          this._toastr.success('Se ha restablecido su contraseña', 'Éxito');
          this._router.navigate(['login']);
        },
        error: (e) => {
          this.loading = false;
          this._toastr.error(e.error, 'Hubo un error');
        },
      });
  }
}
