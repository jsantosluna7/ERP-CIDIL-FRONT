import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [ReactiveFormsModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {

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
