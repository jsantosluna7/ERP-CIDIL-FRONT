import { Component } from '@angular/core';
import { ReservaEquipos } from '../../../interfaces/solicitud-reserva-equipos.interface';
import { SolicitudEquipoService } from '../../../services/reserva-equipo/reserva-equipo.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { InventarioService } from '../../../services/Inventario/inventario.service';
import { forkJoin } from 'rxjs';
import { UsuarioService } from '../usuario/usuarios/usuarios.service';
import { Carta } from '../../../interfaces/carta';
import { Usuarios } from '../../../interfaces/usuarios.interface';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-solicitud-reserva-equipo',
  imports: [ CommonModule, ToastrModule,MatTableModule, MatButtonModule,MatIconModule ],
  templateUrl: './solicitud-reserva-equipo.component.html',
  styleUrl: './solicitud-reserva-equipo.component.css'
})
export class SolicitudReservaEquipoComponent {
solicitud: ReservaEquipos[] = [];
usuarioLogueado: any;

  columnas = [
    'nombreUsuario',
    'nombreEquipo',
    'fechaInicio',
    'fechaFinal',
    'motivo',
    'estado',
    'acciones'
  ];
constructor(private SolicitudEquipoService: SolicitudEquipoService,
   private toastr: ToastrService,
   private usuariosService: UsuariosService,
   private inventarioService: InventarioService,
   private usuarios: UsuarioService
){}

 ngOnInit(): void {
  this.usuariosService.user$.subscribe(user => {
    this.usuarioLogueado = user;
  });

  forkJoin({
    solicitudesResp: this.SolicitudEquipoService.getReservaE(),
    usuariosResp: this.usuarios.obtenerUsuarios(),
    equiposResp: this.inventarioService.getCartas(1, 1000)  // asumiendo que quieres todos los equipos
  }).subscribe({
    next: ({ solicitudesResp, usuariosResp, equiposResp }) => {
      const solicitudes = solicitudesResp.datos;
      const usuarios = usuariosResp?.datos || [];
      const equipos = equiposResp?.datos || equiposResp || [];

      this.solicitud = solicitudes.map((solicitud) => {
        const usuario = usuarios.find(u => u.id === solicitud.idUsuario);
        const equipo = equipos.find((e: Carta) => e.id === solicitud.idInventario);

        return {
          ...solicitud,
          nombreUsuario: usuario ? `${usuario.nombreUsuario} ${usuario.apellidoUsuario}` : 'Desconocido',
          nombreEquipo: equipo?.nombre || 'Equipo no encontrado'
        };
      });
    },
    error: (err) => {
      console.error('Error al cargar datos', err);
      this.toastr.error('Error al cargar solicitudes', 'Error');
    }
  });
}


 aprobar(solicitud: ReservaEquipos) {
  if (!this.usuarioLogueado) {
    this.toastr.error('Usuario logueado no encontrado');
    return;
  }

  const body: ReservaEquipos = {
    ...solicitud,
    idEstado: 1,
    idUsuarioAprobador: this.usuarioLogueado.id,
    fechaEntrega: new Date().toISOString(),
    comentarioAprobacion: 'Aprobado por el usuario logueado'
  };

  this.SolicitudEquipoService.updateEstado( body).subscribe({
    next: () => {
      solicitud.idEstado = 1;
      this.toastr.success(`Solicitud del equipo "${solicitud.nombreEquipo}" aprobada.`, 'Éxito');
      this.SolicitudEquipoService.eliminarSolicitud(solicitud.id).subscribe(() => {
        this.solicitud = this.solicitud.filter(s => s.id !== solicitud.id);
      });
    },
    error: (error) => {
      console.error('Error al aprobar solicitud:', error);
      this.toastr.error('Error al aprobar la solicitud.', 'Error');
    }
  });
}




desaprobar(solicitud: ReservaEquipos) {
  if (!this.usuarioLogueado) {
    this.toastr.error('Usuario logueado no encontrado');
    return;
  }

  const body: ReservaEquipos = {
    ...solicitud,
    idEstado: 3,
    idUsuarioAprobador: this.usuarioLogueado.id,
    fechaEntrega: new Date().toISOString(),
    comentarioAprobacion: 'Solicitud rechazada por el usuario logueado'
  };

  this.SolicitudEquipoService.updateEstado( body).subscribe({
    next: () => {
      solicitud.idEstado = 3;
      this.toastr.success(`Solicitud del equipo "${solicitud.nombreEquipo}" rechazada.`, 'Desaprobada');
      this.SolicitudEquipoService.eliminarSolicitud(solicitud.id).subscribe(() => {
        this.solicitud = this.solicitud.filter(s => s.id !== solicitud.id);
      });
    },
    error: (error) => {
      console.error('Error al desaprobar solicitud:', error);
      this.toastr.error('Error al desaprobar la solicitud.', 'Error');
    }
  });
}







}
