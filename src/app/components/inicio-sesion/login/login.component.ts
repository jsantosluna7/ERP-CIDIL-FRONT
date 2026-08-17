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
  // Encapsulación normal (Emulated, el default de Angular): esto aísla
  // nuestros estilos con un atributo único por componente, así que clases
  // genéricas como .card, .field o .line NO chocan con Bootstrap, Angular
  // Material, u otros componentes de tu app que usen los mismos nombres.
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  /** Formulario reactivo equivalente al <form> del login original */
  loginForm: FormGroup;
  loading: boolean = false;

  //ENDPOINTS
  iniciarSesion = `${process.env['API_URL']}${process.env['ENDPOINT_INICIAR_SESION']}`;

  /** Mismas imágenes/captions que estaban hardcodeadas en el <script> original */
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

  /** Índice del slide activo (equivalente a la variable "current" del script original) */
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
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  /** Equivalente a la función goTo(i) del script original */
  goTo(index: number): void {
    this.current = index;
  }

  /** Equivalente a la función next() del script original */
  next(): void {
    this.goTo((this.current + 1) % this.slides.length);
  }

  /** Equivalente a startAutoplay() del script original */
  startAutoplay(): void {
    this.autoplayTimer = setInterval(() => this.next(), 4500);
  }

  /** Equivalente a stopAutoplay() del script original */
  stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  /** Devuelve true si el campo tiene un error visible (tocado + inválido). */
  hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Maneja el submit del formulario de login (Reactive Forms) */
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

    // Llamada al servicio de inicio de sesión
    // Se utiliza el servicio UsuariosService para realizar la petición
    // Se maneja la respuesta y los posibles errores

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
