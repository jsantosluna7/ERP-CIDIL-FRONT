import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faLock, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

faEnvelope = faEnvelope;
faPhone = faPhone;
faLock = faLock;
faLocationDot = faLocationDot;
faUser = faUser;



registroForm: FormGroup;

constructor(){
  this.registroForm = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
    contrasena: new FormControl('',[Validators.required, Validators.minLength(6)]),
    nombre: new FormControl('',[Validators.required]),
    apellido: new FormControl('',[Validators.required]),
    matricula: new FormControl('',[Validators.required]),
    telefono: new FormControl('',[Validators.required]),
    direccion: new FormControl('',[Validators.required])

  });
}

 register(){
  console.log(this.registroForm.value);
 }
}
