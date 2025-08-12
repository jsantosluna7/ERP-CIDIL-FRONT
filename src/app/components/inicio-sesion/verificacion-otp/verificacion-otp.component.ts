import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { _StructuralStylesLoader } from '@angular/material/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-verificacion-otp',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './verificacion-otp.component.html',
  styleUrl: './verificacion-otp.component.css',
})
export class VerificacionOtpComponent implements OnInit, AfterViewInit {
  correoUsuario: string = '';
  usuarioPendienteId: string = '';

  // Iconos
  faEnvelope = faEnvelope;
  loading = false;
  otpForm: FormGroup;

  VerificacionOtp = `${process.env['API_URL']}${process.env['ENDPOINT_USUARIOS_PENDIENTES']}`;

  @ViewChildren('otp0, otp1, otp2, otp3') otpInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _userService: UsuariosService,
    private _router: Router
  ) {
    this.otpForm = this.fb.group({
      code1: new FormControl('', [Validators.required]),
      code2: new FormControl('', [Validators.required]),
      code3: new FormControl('', [Validators.required]),
      code4: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this._userService.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.correoUsuario = user.correoInstitucional;
        this.usuarioPendienteId = user.sub;
      } else {
        this._toastr.error('No se encontró información del usuario pendiente.');
      }
    });
  }

  ngAfterViewInit() {
    // Poner foco automáticamente en el primer input
    setTimeout(() => {
      this.otpInputs.first?.nativeElement.focus();
    }, 0);
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = this.otpInputs.get(index - 1)?.nativeElement;
      prevInput?.focus();
    }
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const [first, ...rest] = input.value;

    input.value = first ?? '';

    if (first && index < this.otpInputs.length - 1) {
      const nextInput = this.otpInputs.get(index + 1)?.nativeElement;
      nextInput.value = rest.join('');
      nextInput.dispatchEvent(new Event('input'));
      nextInput.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') ?? '';

    if (!pastedData) return;

    const chars = pastedData.split('').slice(0, this.otpInputs.length);

    chars.forEach((char, idx) => {
      const input = this.otpInputs.get(idx)?.nativeElement;
      if (input) {
        input.value = char;
        this.otpForm.get(`code${idx + 1}`)?.setValue(char);
      }
    });

    const lastIdx = chars.length - 1;
    if (lastIdx >= 0 && lastIdx < this.otpInputs.length) {
      this.otpInputs.get(lastIdx)?.nativeElement.focus();
    }
  }

  confirmarOtp() {
    if (this.otpForm.invalid) {
      this._toastr.error(
        'Por favor, complete todos los campos del OTP.',
        'Error'
      );
      return;
    }
    this.loading = true;
    const otpCode = Object.values(this.otpForm.value).join('');

    const body = {
      pendingUserId: this.usuarioPendienteId,
      otp: otpCode,
    };

    this._userService.usuarioPendiente(this.VerificacionOtp, body).subscribe({
      next: (response) => {
        this.loading = false;
        this._router.navigate(['home']);
        this._toastr.success('OTP verificado exitosamente.', 'Éxito');
        this._userService.user$.pipe(take(1)).subscribe((user) => {
          this._toastr.success(
            `Bienvenido, ${user.nombreUsuario} ${user.apellidoUsuario}`,
            'Registro Éxitoso'
          );
        });
        localStorage.removeItem('tokenRegistro');
      },
      error: (err) => {
        this.loading = false;
        this._toastr.error('Error verificando OTP', 'Error');
      },
    });
  }
}
