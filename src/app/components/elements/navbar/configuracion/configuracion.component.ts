import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-configuracion',
  imports: [MatButtonModule,MatDialogModule,FontAwesomeModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionComponent {
 

   faUser = faUser;
   faLocationDot = faLocationDot;
   faPhone = faPhone;
   faEnvelope = faEnvelope;
  
}


