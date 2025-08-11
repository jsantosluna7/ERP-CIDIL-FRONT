import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCheck, faEnvelope, faLocationDot, faLock, faPhone, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { BackButtonComponent } from "../../elements/back-button/back-button.component";
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, FontAwesomeModule, BackButtonComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faLock = faLock;
  faLocationDot = faLocationDot;
  faUser = faUser;
  faCheck = faCheck;
  faXmark = faXmark;


  registroForm: FormGroup;

  meterPopup: any = {};
  passwordValid: any = {};

  //ENDPOINTS
  registrar = `${process.env['API_URL']}${process.env['ENDPOINT_REGISTRAR']}`


  constructor(private _usuarios: UsuariosService, private _toastr: ToastrService, private _router: Router) {
    this.registroForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmarcontrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      matricula: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required])

    }, {
      validators: this.matchContrasena
    });
  }

  register() {
    const data = {
      "idMatricula": this.registroForm.value.matricula,
      "nombreUsuario": this.registroForm.value.nombre,
      "apellidoUsuario": this.registroForm.value.apellido,
      "correoInstitucional": this.registroForm.value.email,
      "contrasenaHash": this.registroForm.value.contrasena,
      "telefono":this.registroForm.value.telefono,
      "direccion": this.registroForm.value.direccion
    }

    this._usuarios.registro(this.registrar, data).subscribe({
      next: (e) => {
        this._router.navigate(['verificacion-otp']);
      },error: (e) => {
        this._toastr.error(e.error.error, 'Hubo un error');
      }
    })
  }

  //Validar contrasena
  matchContrasena: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    let contrasena = control.get('contrasena');
    let confirmarcontrasena = control.get('confirmarcontrasena');
    if (contrasena && confirmarcontrasena && contrasena?.value != confirmarcontrasena?.value) {
      return {
        contrasenaError: true
      }

    }
    // this._toastr.error('La contraseña debe coincidir', 'Error')
    return null;

  }


  ngOnInit() {
    this.registroForm.get('contrasena')?.valueChanges.subscribe(value => {
      this.passwordValidation(value);
    });

    this.closePopup();
  }

  login() {
  }

  openPopup(event: Event) {
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
