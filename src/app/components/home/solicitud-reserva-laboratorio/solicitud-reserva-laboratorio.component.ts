import { Component, Input, input } from '@angular/core';
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
import { DatosService } from '../../../services/Datos/datos.service';
import { DashboardService } from '../../../services/Dashboard/dashboard.service';
import { ServicioDashboardService } from '../../../services/Dashboard/servicio-dashboard.service';
import { PisosService } from '../../../services/Pisos/pisos.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-solicitud-reserva-laboratorio',
  imports: [CommonModule, ToastrModule, MatTableModule,MatButtonModule],
  templateUrl: './solicitud-reserva-laboratorio.component.html',
  styleUrl: './solicitud-reserva-laboratorio.component.css',
})
export class SolicitudReservaLaboratorioComponent {
  solicitudes: Solicitud[] = [];
  @Input() mostrarPiso?: boolean = false;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUD_RESERVA_ESPACIO_PISO']}`;

  columnas: string[] = [
  'nombreUsuario',
  'nombreLaboratorio',
  'horaInicio',
  'horaFinal',
  'motivo',
  'fechaSolicitud',
  'estado',
  'acciones'
];

  constructor(
    private reservaLaboratorioService: SolicitudReservaService,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    private laboratorioService: LaboratorioService,
    private _usuarios: UsuariosService,
    private _datos: DatosService,
    private _dashboard: ServicioDashboardService,
    private _toastr: ToastrService,
    private _piso: PisosService
  ) {}

  usuarioLogueado: any;
  idUsuarioAprobador: number = 0;

  ngOnInit(): void {
    if (this.mostrarPiso) {
      this._piso.piso$.subscribe({
        next: (pisoCorres) => {
          if (pisoCorres != 4) {
            this._usuarios.user$.subscribe((user) => {
              this.usuarioLogueado = user;
            });

            forkJoin({
              solicitudesResp: this._dashboard.getSolicitudReservaPiso(
                this.endpoint,
                pisoCorres
              ), // <- este devuelve un objeto con .datos
              usuariosResp: this.usuarioService.obtenerUsuarios(),
              laboratorios: this.laboratorioService.getLaboratorios(),
            }).subscribe({
              next: ({ solicitudesResp, usuariosResp, laboratorios }) => {
                const solicitudes = solicitudesResp; // ✅ aquí accedes a las solicitudes reales
                const usuarios = usuariosResp.datos;

                this.solicitudes = solicitudes.map((sol: Solicitud) => {
                  const usuario = usuarios.find((u) => u.id === sol.idUsuario);
                  const lab = laboratorios.find(
                    (l) => l.id === sol.idLaboratorio
                  );

                  return {
                    ...sol,
                    nombreUsuario: usuario?.nombreUsuario || 'Desconocido',
                    nombreLaboratorio: lab?.nombre || 'Desconocido',
                    fechaInicio: sol.fechaInicio, // ✅ importante conservar
                    fechaFinal: sol.fechaFinal, // ✅ importante conservar
                  };
                });
              },
              error: (err) => {
                console.error('Error al cargar datos', err);
                this.toastr.error('Error al cargar solicitudes', 'Error');
              },
            });
          } else {
            this._usuarios.user$.subscribe((user) => {
              this.usuarioLogueado = user;
            });

            forkJoin({
              solicitudesResp: this.reservaLaboratorioService.getResevas(), 
              usuariosResp: this.usuarioService.obtenerUsuarios(),
              laboratorios: this.laboratorioService.getLaboratorios(),
            }).subscribe({
              next: ({ solicitudesResp, usuariosResp, laboratorios }) => {
                const solicitudes = solicitudesResp.datos; 
                const usuarios = usuariosResp.datos;

                this.solicitudes = solicitudes.map((sol: Solicitud) => {
                  const usuario = usuarios.find((u) => u.id === sol.idUsuario);
                  const lab = laboratorios.find(
                    (l) => l.id === sol.idLaboratorio
                  );

                  return {
                    ...sol,
                    nombreUsuario: usuario?.nombreUsuario || 'Desconocido',
                    nombreLaboratorio: lab?.nombre || 'Desconocido',
                    fechaInicio: sol.fechaInicio, 
                    fechaFinal: sol.fechaFinal, 
                  };
                });
              },
              error: (err) => {
                console.error('Error al cargar datos', err);
                this.toastr.warning('Error al cargar solicitudes o no existen solicitudes', 'Error');
              },
            });
          }
        },
        error: (err) => {
          this._toastr.error(
            'Error al obtener las solicitudes del piso correspondiente',
            'Hubo un error'
          );
        },
      });
    } else {
      this._usuarios.user$.subscribe((user) => {
        this.usuarioLogueado = user;
      });

      forkJoin({
        solicitudesResp: this.reservaLaboratorioService.getResevas(),
        usuariosResp: this.usuarioService.obtenerUsuarios(),
        laboratorios: this.laboratorioService.getLaboratorios(),
      }).subscribe({
        next: ({ solicitudesResp, usuariosResp, laboratorios }) => {
          const solicitudes = solicitudesResp.datos;
          const usuarios = usuariosResp.datos;

          this.solicitudes = solicitudes.map((sol: Solicitud) => {
            const usuario = usuarios.find((u) => u.id === sol.idUsuario);
            const lab = laboratorios.find((l) => l.id === sol.idLaboratorio);

            return {
              ...sol,
              nombreUsuario: usuario?.nombreUsuario || 'Desconocido',
              nombreLaboratorio: lab?.nombre || 'Desconocido',
              fechaInicio: sol.fechaInicio,
              fechaFinal: sol.fechaFinal,
            };
          });
        },
        error: (err) => {
          console.error('Error al cargar datos', err);
          this.toastr.warning(
            'Error al cargar solicitudes o no existen solicitudes',
            'Error'
          );
        },
      });
    }
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
      comentarioAprobacion: `Aprobado por el usuario: ${this.usuarioLogueado.nombreUsuario}}`,
    };

    console.log('Body que se enviará: ', body);

    this.reservaLaboratorioService.updateEstado(body).subscribe({
      next: () => {
        solicitud.idEstado = 1;
        this.solicitudes = this.solicitudes.filter(
          (s) => s.id !== solicitud.id
        );
        this.toastr.success('Solicitud aprobada correctamente', 'Éxito');
      },
      error: (err) => {
        console.error('Error al aprobar solicitud:', err);
        this.toastr.error('Error al aprobar la solicitud', 'Error');
      },
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
      comentarioAprobacion: 'Solicitud rechazada por el usuario logueado',
    };

    console.log('Body que se enviará (desaprobar): ', body);

    this.reservaLaboratorioService.updateEstado(body).subscribe({
      next: () => {
        // Quita del frontend la solicitud rechazada
        this.solicitudes = this.solicitudes.filter(
          (s) => s.id !== solicitud.id
        );
        this.toastr.info('Solicitud desaprobada correctamente', 'Información');
      },
      error: (err) => {
        console.error('Error al desaprobar solicitud:', err);
        this.toastr.error('Error al desaprobar la solicitud', 'Error');
      },
    });
  }
}
