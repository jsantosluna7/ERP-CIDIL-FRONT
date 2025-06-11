import { Component} from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud-reserva-espacio.interface';
import { SolicitudReservaService } from '../../../services/reserva-laboratorio/reserva-laboratorio.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-solicitud-reserva-laboratorio',
  imports: [CommonModule ],
  templateUrl: './solicitud-reserva-laboratorio.component.html',
  styleUrl: './solicitud-reserva-laboratorio.component.css'
})
export class SolicitudReservaLaboratorioComponent {

solicitudes: Solicitud[] = [];

constructor(private reservaLaboratorioService: SolicitudReservaService ){}

ngOnInit(): void {
  this.reservaLaboratorioService.getResevas().subscribe({
    next: (data: any) => {
      this.solicitudes = data.datos;
      console.log(data.datos)
    },
    error: (error) =>{
      console.error('Error al cargar las solicitudes', error)
    }
  });
}

aprobar(solicitud: Solicitud){
  this.reservaLaboratorioService.updateEstado(solicitud.idLaboratorio, 'aprobado').subscribe({
    next: () => {
      solicitud.idEstado = 'aprobado';
      console.log(`Solicitud ${solicitud.idLaboratorio} aprobada.`);
    },
    error: (error) => {
      console.error('Error al aprobar solicitud:', error);
    }
  });
}


desaprobar(solicitud: Solicitud) {
  this.reservaLaboratorioService.updateEstado(solicitud.idLaboratorio, 'desaprobado').subscribe({
    next: () => {
      solicitud.idEstado = 'desaprobado';
      console.log(`Solicitud ${solicitud.idLaboratorio} desaprobada`);
    },
    error: (error) => {
      console.error('Error al desaprobar solicitud:', error);
    }
  });
}



}
