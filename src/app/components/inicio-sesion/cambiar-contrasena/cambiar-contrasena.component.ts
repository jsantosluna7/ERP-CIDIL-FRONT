import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faLock, faXmark } from '@fortawesome/free-solid-svg-icons';
import { BackButtonComponent } from "../../elements/back-button/back-button.component";

@Component({
  selector: 'app-cambiar-contrasena',
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, BackButtonComponent],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent implements OnInit{
  faLock = faLock;
  faCheck = faCheck;
  faXmark = faXmark;

  recuperarContrasenaForm: FormGroup;
  meterPopup: any = {};
  passwordValid: any = {};

  constructor(){
    this.recuperarContrasenaForm = new FormGroup({
       contrasena: new FormControl('',[Validators.required, Validators.minLength(6)]),
       confirmarContrasena: new FormControl('',[Validators.required, Validators.minLength(6)]),
    },
  {
    validators: this.matchContrasena
  });
  }

  recuperar(){
  console.log(this.recuperarContrasenaForm.value);
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
    this.meterPopup = {'display': 'none'};
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
