import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faLock, faXmark } from '@fortawesome/free-solid-svg-icons';
import { BackButtonComponent } from "../../elements/back-button/back-button.component";
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena',
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, BackButtonComponent],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent implements OnInit {
  faLock = faLock;
  faCheck = faCheck;
  faXmark = faXmark;

  recuperarContrasenaForm: FormGroup;
  meterPopup: any = {};
  passwordValid: any = {};
  token: string = '';

  //ENDPOINTS
  restablecerContrasena = `${process.env['API_URL']}${process.env['ENDPOINT_RESTABLECER_CONTRASENA']}`

  constructor(private _usuarios: UsuariosService, private _toastr: ToastrService, private _router: Router, private _token: ActivatedRoute) {
    this.recuperarContrasenaForm = new FormGroup({
      contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmarContrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
    },
      {
        validators: this.matchContrasena
      });
  }

  recuperar() {

    const data = {
      "token": this.token,
      "nuevaContrasena": this.recuperarContrasenaForm.value.contrasena
    }

    this._usuarios.restablecerContrasena(this.restablecerContrasena, data).subscribe({
      next: (e) => {
        this._toastr.success('Se ha restablecido su contraseña', 'Éxito');
        this._router.navigate(['login']);
      },error: (e) => {
        this._toastr.error(e.error, 'Hubo un error');
      }
    })
  }

  //Validar contrasena
  matchContrasena: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    let contrasena = control.get('contrasena');
    let confirmarContrasena = control.get('confirmarContrasena');
    if (contrasena && confirmarContrasena && contrasena?.value != confirmarContrasena?.value) {
      return {
        contrasenaError: true
      }
    }
    return null;
  }

  ngOnInit() {
    this.recuperarContrasenaForm.get('contrasena')?.valueChanges.subscribe(value => {
      this.passwordValidation(value);
    });

    this._token.queryParams.subscribe(params => {
      const token = params['token'];
      this.token = token;
    })
    this.closePopup();
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
