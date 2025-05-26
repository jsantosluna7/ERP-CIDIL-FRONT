import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faEnvelope, faHome, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reserva-equipo',
  imports: [FontAwesomeModule],
  templateUrl: './reserva-equipo.component.html',
  styleUrl: './reserva-equipo.component.css'
})
export class ReservaEquipoComponent {
  faUser = faUser;
   faLocationDot = faLocationDot;
   faPhone = faPhone;
   faEnvelope = faEnvelope;
   fahouse= faHome;
   faclock = faClock;
}
