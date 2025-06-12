import { Component } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud-reserva-espacio.interface';
import { SolicitudReservaService } from '../../../services/reserva-laboratorio/reserva-laboratorio.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-solicitud-reserva-laboratorio',
  imports: [CommonModule, ToastrModule],
  templateUrl: './solicitud-reserva-laboratorio.component.html',
  styleUrl: './solicitud-reserva-laboratorio.component.css',
})
export class SolicitudReservaLaboratorioComponent {
  solicitudes: Solicitud[] = [];

  constructor(
    private reservaLaboratorioService: SolicitudReservaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.reservaLaboratorioService.getResevas().subscribe({
      next: (data: any) => {
        this.solicitudes = data.datos;
      },
      error: (error) => {
        console.error('Error al cargar las solicitudes', error);
        this.toastr.error('Ocurrió un error al cargar  la solicitud.', 'Error');
      },
    });
  }

 /* aprobar(solicitud: Solicitud) {
    const body = {
      idEstado: 3,
      idLaboratorio:1,
      idUsuarioAprobador: 4,
      idUsuario: 3,
    };
    
    
    this.reservaLaboratorioService.updateEstado(solicitud.id, body).subscribe({
      next: () => {
        solicitud.idEstado = 1;
        this.toastr.success('Solicitud aprobada correctamente', 'Éxito');
        console.log(body)
      },
      error: (err) => {
        console.error('Error al aprobar solicitud:', err);
        this.toastr.error('Error al aprobar la solicitud', 'Error');
      },
    });
  }*/


    aprobar(solicitud: Solicitud) {
  const body: Solicitud = {
    ...solicitud,
    idEstado: 1,
    
  };

  this.reservaLaboratorioService.updateEstado(solicitud.id, body).subscribe({
    next: () => {
      solicitud.idEstado = 1;
      this.toastr.success('Solicitud aprobada correctamente', 'Éxito');
      console.log('Body enviado:', body);
    },
    error: (err) => {
      console.error('Error al aprobar solicitud:', err);
      this.toastr.error('Error al aprobar la solicitud', 'Error');
    },
  });
}

 /* desaprobar(solicitud: Solicitud) {
    const body = {
      idEstado: 3,
      idLaboratorio:0,
      idUsuarioAprobador: 4,
      idUsuario: 3,
    };

    this.reservaLaboratorioService.updateEstado(solicitud.id, body).subscribe({
      next: () => {
        console.log(solicitud.id);
        this.toastr.info('Solicitud desaprobada correctamente', 'Información');
      },
      error: (err) => {
        console.error('Error al desaprobar solicitud:', err);
        this.toastr.error('Error al desaprobar la solicitud', 'Error');
      },
    });
  }*/


    desaprobar(solicitud: Solicitud) {
  const body = {
    idEstado: 3, // Asegúrate que 2 representa "desaprobado"
    idLaboratorio: solicitud.idLaboratorio,
    idUsuarioAprobador: 4, // Puedes cambiarlo por el usuario actual si es dinámico
    idUsuario: solicitud.idUsuario
  };

  this.reservaLaboratorioService.updateEstado(solicitud.id, body).subscribe({
    next: () => {
      solicitud.idEstado = 3;
      this.toastr.info('Solicitud desaprobada correctamente', 'Información');
      console.log(body);
    },
    error: (err) => {
      console.error('Error al desaprobar solicitud:', err);
      this.toastr.error('Error al desaprobar la solicitud', 'Error');
    },
  });
}
}
