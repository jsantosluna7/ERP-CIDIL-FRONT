import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  faEnvelope = faEnvelope;
  faLock = faLock


  // FormGroup para el formulario de inicio de sesión
  // Se utiliza ReactiveFormsModule para la gestión de formularios reactivos
  // Se importan los módulos necesarios desde Angular y FontAwesome
  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
      // rememberMe: new FormControl(false)
    });
  }

  login(){
    console.log(this.loginForm.value);
  }
}
