import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { BackButtonComponent } from "../../elements/back-button/back-button.component";

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [ReactiveFormsModule, FontAwesomeModule, BackButtonComponent],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {

  faEnvelope = faEnvelope;
  recuperarContrasenaForm: FormGroup;

  constructor(){
    this.recuperarContrasenaForm = new FormGroup({
       email: new FormControl('',[Validators.required,Validators.email]),
    });
  }

  register(){
  console.log(this.recuperarContrasenaForm.value);
 }
}
