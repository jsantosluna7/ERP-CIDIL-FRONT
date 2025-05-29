import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faUser,faHome,faClock, faHourglass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reserva-laboratorio',
  imports: [FontAwesomeModule],
  templateUrl: './reserva-laboratorio.component.html',
  styleUrl: './reserva-laboratorio.component.css'
})
export class ReservaLaboratorioComponent {


faUser = faUser;
 faLocationDot = faLocationDot;
 faPhone = faPhone;
 faEnvelope = faEnvelope;
 fahouse= faHome;
 faclock = faClock;
 estado =faHourglass;

}
