import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faUser,faHome,faClock, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';

@Component({
  selector: 'app-reserva-laboratorio',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './reserva-laboratorio.component.html',
  styleUrl: './reserva-laboratorio.component.css'
})
export class ReservaLaboratorioComponent {

  laboratorios: Laboratorio[]=[];
  solicitudesForm!: FormGroup;
  faUser = faUser;
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  fahouse= faHome;
  faclock = faClock;
  estado =faHourglass;


 constructor(private laboratorioService: LaboratorioService){}

 ngOnInit(): void {
    this.laboratorioService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
        console.log(data)
      },
      error: (err) => {
        console.error('Error al obtener laboratorios', err);
      }
    });
  }

enviarSolicitud(){

}

}
