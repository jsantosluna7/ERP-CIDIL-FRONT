import { Component } from '@angular/core';
import { ReservaEquipos } from '../../../interfaces/solicitud-reserva-equipos.interface';
import { SolicitudEquipoService } from '../../../services/reserva-equipo/reserva-equipo.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitud-reserva-equipo',
  imports: [ CommonModule, ToastrModule],
  templateUrl: './solicitud-reserva-equipo.component.html',
  styleUrl: './solicitud-reserva-equipo.component.css'
})
export class SolicitudReservaEquipoComponent {
solicitud: ReservaEquipos[] = [];

constructor(private SolicitudEquipoService: SolicitudEquipoService, private toastr: ToastrService){}

ngOnInit(): void{
  this.SolicitudEquipoService.getReservaE().subscribe({
    next: (data: any) => {
      this.solicitud = data.datos;
      console.log(data.datos)
    },
    error: (error) =>{
      console.error('Error al cargar las solicitudes', error);
      this.toastr.error('Ocurrió un error al cargar la solicitud.', 'Error');
    
    }
  });
}

aprobar(solicitud: ReservaEquipos){

   const body: ReservaEquipos = {
      ...solicitud,
      idEstado: 1,
   }

  this.SolicitudEquipoService.updateEstado(solicitud.id, body).subscribe({
    next: () => {
      solicitud.idEstado = 1;
      this.toastr.success(`Solicitud #${solicitud.idInventario} Aprobada correctamente.`, 'Exito')
    },
    error: (error) => {
      console.error('Error al aprobar solicitud:', error);
        this.toastr.error('Ocurrió un error al aprobar la solicitud.', 'Error');
      
    }
  });
}


desaprobar(solicitud: ReservaEquipos) {

  const body: ReservaEquipos = {
      ...solicitud,
      idEstado: 1,
   }
  this.SolicitudEquipoService.updateEstado(solicitud.id, body).subscribe({
    next: () => {
      solicitud.idEstado = 3;
      this.toastr.success(`Solicitud ${solicitud.idInventario} desaprobada.`);
    },
    error: (error) => {
      console.error('Error al desaprobar solicitud:', error);
      this.toastr.error('Ocurrió un error al desaprobar la solicitud.', 'Error');
    
    }
  });
}






}
