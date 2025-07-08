import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faEnvelope, faLock, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  faEnvelope = faEnvelope;
  faLock = faLock;
  faCheck = faCheck;
  faXmark = faXmark;

  // FormGroup para el formulario de inicio de sesión
  // Se utiliza ReactiveFormsModule para la gestión de formularios reactivos
  // Se importan los módulos necesarios desde Angular y FontAwesome
  loginForm: FormGroup;
  meterPopup: any = {};
  passwordValid: any = {};

  //ENDPOINTS
  iniciarSesion = `${process.env['API_URL']}${process.env['ENDPOINT_INICIAR_SESION']}`

  constructor(private _usuario: UsuariosService, private _toastr: ToastrService, private _router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
      // rememberMe: new FormControl(false)
    });
  }

  ngOnInit() {
    this.loginForm.get('contrasena')?.valueChanges.subscribe(value => {
      this.passwordValidation(value);
    });

    this.closePopup();
  }

  login() {
    const data = {
      "correoInstitucional": this.loginForm.value.email,
      "contrasena": this.loginForm.value.contrasena
    }
    
    this._usuario.iniciarSesion(this.iniciarSesion, data).subscribe({
      next: (e) => {
        this._toastr.success(`Bienvenido, ${e.nombreUsuario} ${e.apellidoUsuario}`, 'Inicio Éxitoso')
        this._router.navigate(['home'])
      },error: (err) => {
        this._toastr.error(err.error.error, 'Hubo un error');
      },
    })
  }

  openPopup($event: Event) {
    const contrasenaElem = document.querySelector('#contrasena');
    if (contrasenaElem) {
      const rect = contrasenaElem.getBoundingClientRect();
      this.meterPopup = {
        'display': 'block',
        'position': 'absolute',
        'left.px': window.scrollY + rect.left,
        'top.px': window.scrollY + rect.top + 39,
      };
    } else {
      this.meterPopup = {
        'display': 'none'
      };
      console.warn('Elemento con id "contrasena" no encontrado.');
    }
  }
  closePopup() {
    this.meterPopup = { 'display': 'none' };
  }
  passwordValidation(PasswordText: any) {
    const hasUpperCase = /[A-Z]/.test(PasswordText);
    const hasLowerCase = /[a-z]/.test(PasswordText);
    const hasNumeric = /[0-9]/.test(PasswordText);
    const hasSpecialCharacterCheck = /\W|_/g;
    const hasSpecialCharacter = hasSpecialCharacterCheck.test(PasswordText);
    const hasNoSpaces = !/\s/.test(PasswordText);

    this.passwordValid.hasMinLength = PasswordText.length >= 6 ? true : false;
    this.passwordValid.hasUpperCase = hasUpperCase;
    this.passwordValid.hasLowerCase = hasLowerCase;
    this.passwordValid.hasNumber = hasNumeric;
    this.passwordValid.hasSpecialChar = hasSpecialCharacter;
    this.passwordValid.hasNoSpaces = hasNoSpaces;
  }

}
