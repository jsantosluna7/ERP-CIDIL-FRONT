import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-usuarios',
  imports: [FontAwesomeModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {


 faUser = faUser;
 faLocationDot = faLocationDot;
 faPhone = faPhone;
 faEnvelope = faEnvelope;

}
