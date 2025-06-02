import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faUser,faHome,faClock, faHourglass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reserva-laboratorio',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './reserva-laboratorio.component.html',
  styleUrl: './reserva-laboratorio.component.css'
})
export class ReservaLaboratorioComponent {

  solicitudesForm!: FormGroup;

faUser = faUser;
 faLocationDot = faLocationDot;
 faPhone = faPhone;
 faEnvelope = faEnvelope;
 fahouse= faHome;
 faclock = faClock;
 estado =faHourglass;


enviarSolicitud(){

}

}
