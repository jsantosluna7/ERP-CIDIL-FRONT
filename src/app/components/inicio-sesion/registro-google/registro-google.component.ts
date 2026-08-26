import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { GoogleOauthStateService } from '../../../services/GoogleOauth/google-oauth-state.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';

export interface DatosRegistro {
  matricula: string;
  telefono: string;
  direccion: string;
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
  selector: 'app-registro-google',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-google.component.html',
  styleUrl: './registro-google.component.css',
})
export class RegistroGoogleComponent implements OnInit {
  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_REGISTRO_GOOGLE']}`;

  form!: FormGroup;
  nombre: string | null = '';
  fotoPerfil: string | null = '';

  private readonly errorMessages: Record<string, Record<string, string>> = {
    matricula: { required: 'Ingresa tu matrícula o ID de empleado.' },
    telefono: {
      required: 'Ingresa tu número de teléfono.',
      phoneFormat: 'Formato esperado: (809) 555-1234.',
    },
    direccion: {
      required: 'Ingresa tu dirección de domicilio.',
      minlength: 'La dirección es demasiado corta.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private _authState: GoogleOauthStateService,
    private http: HttpClient,
    private router: Router,
    private _usuario: UsuariosService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const datos = this._authState.getUserData();

    //Setear nombre de usuario e imagen de perfil
    this.nombre = datos?.nombre ?? null;
    this.fotoPerfil = datos?.foto ?? null;

    this.form = this.fb.group({
      email: [{ value: datos?.email, disabled: true }],
      nombre: [datos?.nombre, Validators.required],
      apellido: [datos?.apellido, Validators.required],
      matricula: ['', Validators.required],
      telefono: ['', [Validators.required, phoneFormatValidator]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  /** Autoformatea el teléfono mientras el usuario escribe. Reutilizable para otros campos de teléfono. */
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatPhoneInput(input.value);
    this.form.get('telefono')?.setValue(formatted, { emitEvent: false });
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

  completarRegistro() {
    const accessToken = this._authState.getAccessToken();
    if (!accessToken) {
      this.router.navigate(['acceso/login']);
      return;
    }

    const payload = {
      accessToken,
      idMatricula: this.form.value.matricula,
      telefono: this.form.value.telefono,
      direccion: this.form.value.direccion,
    };

    this.http.post<any>(this.endpoint, payload).subscribe({
      next: (res) => {
        this._usuario.establecerSesionDesdeToken(res.tokenId)
        this._authState.limpiar(); // ya no necesitamos el accessToken de Google
        this.router.navigate(['home']);
      },
      error: (err) => {
        this._toastr.error('Error al completar registro', 'Error')
        console.error('Error al completar registro:', err);
        // mostrar el mensaje de error al usuario
      },
    });
  }
}
