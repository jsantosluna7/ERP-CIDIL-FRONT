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
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FontAwesomeModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  faEnvelope = faEnvelope;
  faLock = faLock;
  faCheck = faCheck;
  faXmark = faXmark;
  loading = false;

  // FormGroup para el formulario de inicio de sesión
  // Se utiliza ReactiveFormsModule para la gestión de formularios reactivos
  // Se importan los módulos necesarios desde Angular y FontAwesome
  loginForm: FormGroup;
  meterPopup: any = {};
  passwordValid: any = {};

  //ENDPOINTS
  iniciarSesion = `${process.env['API_URL']}${process.env['ENDPOINT_INICIAR_SESION']}`;

  constructor(
    private _usuario: UsuariosService,
    private _toastr: ToastrService,
    private _router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      // rememberMe: new FormControl(false)
    });
  }

  login() {
    const data = {
      correoInstitucional: this.loginForm.value.email,
      contrasena: this.loginForm.value.contrasena,
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
              'Inicio Éxitoso'
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
