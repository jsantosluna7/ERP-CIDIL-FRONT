import { Component } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud-reserva-espacio.interface';
import { SolicitudReservaService } from '../../../services/reserva-laboratorio/reserva-laboratorio.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../usuario/usuarios/usuarios.service';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { forkJoin } from 'rxjs';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';

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
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    private laboratorioService: LaboratorioService,
    private _usuarios: UsuariosService
  ) {}

usuarioLogueado: any;
idUsuarioAprobador: number = 0;

ngOnInit(): void {

  this._usuarios.user$.subscribe(user => {
    this.usuarioLogueado = user;
  });

  forkJoin({
    solicitudesResp: this.reservaLaboratorioService.getResevas(),  // <- este devuelve un objeto con .datos
    usuariosResp: this.usuarioService.obtenerUsuarios(),
    laboratorios: this.laboratorioService.getLaboratorios()
  }).subscribe({
    next: ({ solicitudesResp, usuariosResp, laboratorios }) => {
      const solicitudes = solicitudesResp.datos; // ✅ aquí accedes a las solicitudes reales
      const usuarios = usuariosResp.datos;

      this.solicitudes = solicitudes.map((sol: Solicitud) => {
        const usuario = usuarios.find((u) => u.id === sol.idUsuario);
        const lab = laboratorios.find((l) => l.id === sol.idLaboratorio);

        return {
          ...sol,
          nombreUsuario: usuario?.nombreUsuario || 'Desconocido',
          nombreLaboratorio: lab?.nombre || 'Desconocido',
          fechaInicio: sol.fechaInicio,    // ✅ importante conservar
          fechaFinal: sol.fechaFinal       // ✅ importante conservar
        };
      });
    },
    error: (err) => {
      console.error('Error al cargar datos', err);
      this.toastr.error('Error al cargar solicitudes', 'Error');
    }
  });
}


aprobar(solicitud: Solicitud) {
  console.log('aprobar solicitud:', solicitud);
  if (!solicitud) {
    console.error('Solicitud es undefined o null');
    return;
  }

  if (!this.usuarioLogueado) {
    console.error('Usuario logueado no está definido');
    return;
  }

  const body = {
    id: solicitud.id,
    idUsuario: solicitud.idUsuario,
    idLaboratorio: solicitud.idLaboratorio,
    horaInicio: solicitud.horaInicio,
    horaFinal: solicitud.horaFinal,
    fechaInicio: solicitud.fechaInicio,
    fechaFinal: solicitud.fechaFinal,
    motivo: solicitud.motivo,
    fechaSolicitud: solicitud.fechaSolicitud,
    idEstado: 1,
    idUsuarioAprobador: this.usuarioLogueado.id,
    fechaAprobacion: new Date().toISOString(),
    comentarioAprobacion: 'Aprobado por el usuario logueado'
  };

  console.log('Body que se enviará: ', body);

  this.reservaLaboratorioService.updateEstado( body).subscribe({
    next: () => {
      solicitud.idEstado = 1;
      this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
      this.toastr.success('Solicitud aprobada correctamente', 'Éxito');
    },
    error: (err) => {
      console.error('Error al aprobar solicitud:', err);
      this.toastr.error('Error al aprobar la solicitud', 'Error');
    }
  });
}




desaprobar(solicitud: Solicitud) {
  console.log('desaprobar solicitud:', solicitud);
  
  if (!solicitud) {
    console.error('Solicitud es undefined o null');
    return;
  }

  if (!this.usuarioLogueado) {
    console.error('Usuario logueado no está definido');
    return;
  }

  const body = {
    id: solicitud.id,
    idUsuario: solicitud.idUsuario,
    idLaboratorio: solicitud.idLaboratorio,
    horaInicio: solicitud.horaInicio,
    horaFinal: solicitud.horaFinal,
    fechaInicio: solicitud.fechaInicio,
    fechaFinal: solicitud.fechaFinal,
    motivo: solicitud.motivo,
    fechaSolicitud: solicitud.fechaSolicitud,
    idEstado: 3, // Rechazado
    idUsuarioAprobador: this.usuarioLogueado.id,
    fechaAprobacion: new Date().toISOString(),
    comentarioAprobacion: 'Solicitud rechazada por el usuario logueado'
  };

  console.log('Body que se enviará (desaprobar): ', body);

  this.reservaLaboratorioService.updateEstado(body).subscribe({
    next: () => {
      // Quita del frontend la solicitud rechazada
      this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
      this.toastr.info('Solicitud desaprobada correctamente', 'Información');
    },
    error: (err) => {
      console.error('Error al desaprobar solicitud:', err);
      this.toastr.error('Error al desaprobar la solicitud', 'Error');
    }
  });
}




}
