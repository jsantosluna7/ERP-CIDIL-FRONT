import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

interface Slide {
  url: string;
  caption: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean = false;

  iniciarSesion = `${process.env['API_URL']}${process.env['ENDPOINT_INICIAR_SESION']}`;

  slides: Slide[] = [
    {
      url: 'assets/cidil/edificio-cidil-completo.jpg',
      caption: 'Nuestro edificio',
    },
    {
      url: 'assets/cidil/laboratorios/redes-convergentes.jpg',
      caption: 'Laboratorios modernos',
    },
    {
      url: 'assets/cidil/laboratorios/manufactura-automatizada.jpg',
      caption: 'Equipos de ultima generación',
    },
    {
      url: 'assets/cidil/sala-telepresencialidad-1.jpg',
      caption: 'Vida estudiantil',
    },
  ];

  current = 0;

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private _usuario: UsuariosService,
    private _toastr: ToastrService,
    private _router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  ngOnInit(): void {
    this.startAutoplay();
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll');
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    document.body.classList.remove('no-scroll');
    document.documentElement.classList.remove('no-scroll');
  }

  goTo(index: number): void {
    this.current = index;
  }

  next(): void {
    this.goTo((this.current + 1) % this.slides.length);
  }

  startAutoplay(): void {
    this.autoplayTimer = setInterval(() => this.next(), 4500);
  }

  stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  /** Devuelve true si el campo tiene un error visible (tocado + inválido). */
  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  /** Mensaje de error a mostrar en el tooltip del ícono "i". */
  errorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control || !control.errors) return '';

    if (controlName === 'email') {
      if (control.hasError('required')) return 'El correo es obligatorio.';
      if (control.hasError('email')) return 'Formato de correo inválido.';
    }

    if (controlName === 'password') {
      if (control.hasError('required')) return 'La contraseña es obligatoria.';
    }

    return 'Campo inválido.';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const data = {
      correoInstitucional: this.loginForm.value.email,
      contrasena: this.loginForm.value.password,
    };

    this.loading = true;

    this._usuario.iniciarSesion(this.iniciarSesion, data).subscribe({
      next: (e) => {
        this._usuario.user$.pipe(take(1)).subscribe((u: any) => {
          this.loading = false;
          if (u) {
            this._toastr.success(
              `Bienvenido, ${u.nombreUsuario} ${u.apellidoUsuario}`,
              'Inicio Éxitoso',
            );
          }
        });
        this._router.navigate(['home']);
      },
      error: (err) => {
        this.loading = false;
        this._toastr.error(err.error.error, 'Hubo un error');
      },
    });
  }
}
