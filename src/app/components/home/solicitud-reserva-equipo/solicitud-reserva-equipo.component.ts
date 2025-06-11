import { Component } from '@angular/core';
import { ReservaEquipos } from '../../../interfaces/solicitud-reserva-equipos.interface';
import { SolicitudEquipoService } from '../../../services/reserva-equipo/reserva-equipo.service';

@Component({
  selector: 'app-solicitud-reserva-equipo',
  imports: [],
  templateUrl: './solicitud-reserva-equipo.component.html',
  styleUrl: './solicitud-reserva-equipo.component.css'
})
export class SolicitudReservaEquipoComponent {
solicitud: ReservaEquipos[] = [];

constructor(private SolicitudEquipoService: SolicitudEquipoService){}

ngOnInit(): void{
  this.SolicitudEquipoService.getReservaE().subscribe({
    next: (data: any) => {
      this.solicitud = data.datos;
      console.log(data.datos)
    },
    error: (error) =>{
      console.error('Error al cargar las solicitudes', error)
    }
  });
}

aprobar(solicitud: ReservaEquipos){
  this.SolicitudEquipoService.updateEstado(solicitud.idInventario, 'aprobado').subscribe({
    next: () => {
      solicitud.IdEstado = 'aprobado';
      console.log(`Solicitud ${solicitud.idInventario} aprobada.`);
    },
    error: (error) => {
      console.error('Error al aprobar solicitud:', error);
    }
  });
}


desaprobar(solicitud: ReservaEquipos) {
  this.SolicitudEquipoService.updateEstado(solicitud.idInventario, 'desaprobado').subscribe({
    next: () => {
      solicitud.IdEstado = 'desaprobado';
      console.log(`Solicitud ${solicitud.idInventario} desaprobada`);
    },
    error: (error) => {
      console.error('Error al desaprobar solicitud:', error);
    }
  });
}






}
