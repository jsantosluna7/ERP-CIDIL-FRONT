import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faEnvelope,
  faLock,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { LikeService } from '../../../likes.service'; // << IMPORTAR LikeService
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FontAwesomeModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  faEnvelope = faEnvelope;
  faLock = faLock;
  faCheck = faCheck;
  faXmark = faXmark;
  loading = false;

  loginForm: FormGroup;
  meterPopup: any = {};
  passwordValid: any = {};

  // ENDPOINTS — ten en cuenta que process.env puede no estar disponible en runtime en Angular;
  // revisa tu configuración de environment si da problemas.
  iniciarSesion: string = `${(process as any).env?.API_URL ?? ''}${(process as any).env?.ENDPOINT_INICIAR_SESION ?? ''}`;

  constructor(
    private _usuario: UsuariosService,
    private _toastr: ToastrService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _likesService: LikeService // << INYECTAR LikeService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {
    // Nada adicional por ahora
  }

  /**
   * Normaliza una ruta (quita barras iniciales/finales y params).
   */
  private _normalizePath(path: string | undefined): string | undefined {
    if (!path) return undefined;
    // Quitamos query string y barras front/back, y la ponemos en minúsculas
    let cleaned = path.split('?')[0].replace(/^\/|\/$/g, '');
    return cleaned.toLowerCase().trim();
  }

  login(): void {
    // ----------------------------------------------------
    // CONSTANTES DE RUTEO MOVIDAS AL INICIO DEL MÉTODO LOGIN()
    // ----------------------------------------------------
    // Ruta por defecto: Home público.
    const defaultPath = '/';

    // Rutas que NO queremos usar como destino directo (landing/login/registro, o vacías)
    const forbiddenLandingPaths = new Set([
      '',
      'auth',
      'auth/login',
      'auth/registrar',
      'auth/recuperar-contrasena',
    ]);
    // ----------------------------------------------------

    if (this.loginForm.invalid) {
      this._toastr.warning('Completa los campos correctamente', 'Formulario inválido');
      return;
    }

    const data = {
      correoInstitucional: this.loginForm.value.email,
      contrasena: this.loginForm.value.contrasena,
    };

    this.loading = true;

    this._usuario.iniciarSesion(this.iniciarSesion, data).subscribe({
      next: () => {
        // Obtenemos el usuario desde el stream del servicio (user$)
        this._usuario.user$.pipe(take(1)).subscribe({ 
          next: (u: any) => {
            this.loading = false;

            if (u) {
              // Guardar usuario en localStorage
              localStorage.setItem('usuario', JSON.stringify(u));

              // Mostrar mensaje de éxito
              this._toastr.success(
                `Bienvenido, ${u.nombreUsuario ?? u.nombre ?? ''} ${u.apellidoUsuario ?? ''}`,
                'Inicio Exitoso'
              );

              // ---- Lógica robusta de redirección (con ejecución de acción pendiente) ----
              const rawReturnUrl = this._route.snapshot.queryParams['returnUrl'];
              const action = this._route.snapshot.queryParams['action'];
              const anuncioIdStr = this._route.snapshot.queryParams['anuncioId'];
              const anuncioId = anuncioIdStr ? Number(anuncioIdStr) : null;
              
              const normalizedReturnUrl = this._normalizePath(rawReturnUrl);

              let finalPath = defaultPath;

              if (rawReturnUrl && rawReturnUrl.length > 0) {
                if (!forbiddenLandingPaths.has(normalizedReturnUrl ?? '')) {
                  // Usamos la URL de retorno original, quitando los parámetros de acción para no repetirlos
                  finalPath = rawReturnUrl.split('?')[0];
                } else {
                  finalPath = defaultPath;
                }
              }

              // LOGS para debugging
              console.log('[LOGIN] returnUrl (raw):', rawReturnUrl);
              console.log('[LOGIN] normalizedReturnUrl:', normalizedReturnUrl);
              console.log('[LOGIN] action:', action, 'anuncioId:', anuncioId);
              console.log('[LOGIN] Redirigiendo a finalPath:', finalPath);

              // --------------------------------------------
              // >> EJECUCIÓN DE ACCIÓN PENDIENTE (LIKE) <<
              // --------------------------------------------
              if (action === 'like' && anuncioId !== null) {
                console.log(`[LOGIN ACTION] Ejecutando like pendiente para anuncio ${anuncioId}`);

                // Verificamos que el servicio tenga el método y lo llamamos.
                const svc: any = this._likesService;
                
                if (typeof svc.toggleLike === 'function') {
                  svc.toggleLike(anuncioId).subscribe({
                    next: () => {
                      console.log(`[LOGIN ACTION] Like aplicado correctamente.`);
                      this._toastr.success('¡Me Gusta aplicado!', 'Acción Pendiente');
                      // Redirigir después del éxito del like
                      this._router.navigateByUrl(finalPath);
                    },
                    error: (err: any) => {
                      console.error('[LOGIN ACTION] Error al aplicar like, redirigiendo al home sin éxito.', err);
                      this._toastr.error('No se pudo aplicar el "Me Gusta".', 'Acción Fallida');
                      // Redirigir a pesar del error
                      this._router.navigateByUrl(finalPath);
                    }
                  });
                } else {
                  // Si no hay acción de like (o no se pudo ejecutar), redirigir de inmediato.
                  this._router.navigateByUrl(finalPath);
                }
              } else {
                // Si no hay acción pendiente, redirigir de inmediato.
                this._router.navigateByUrl(finalPath);
              }
            } else {
              this._toastr.error('No se recibió información del usuario.', 'Error');
              this._router.navigateByUrl(defaultPath); // Redirigir al home si falla la obtención de usuario
            }
          }
        });
      },
      error: (err) => {
        this.loading = false;
        const mensaje =
          err?.error?.error || err?.error?.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.';
        this._toastr.error(mensaje, 'Error');
      },
    });
  }
}


