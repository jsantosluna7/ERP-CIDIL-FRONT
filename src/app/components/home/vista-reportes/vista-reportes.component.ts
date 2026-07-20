import { Component } from '@angular/core';
import { ReporteFalla } from '../../../interfaces/reporteFalla.interface';
import { ReporteFallaService } from '../../../services/Api/ReporteFalla/reporteFalla.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UtilitiesService } from '../../../services/Utilities/utilities.service';
import { forkJoin } from 'rxjs';
import { UsuarioService } from '../usuario/usuarios/usuarios.service';

@Component({
  selector: 'app-vista-reportes',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatProgressSpinner],
  templateUrl: './vista-reportes.component.html',
  styleUrl: './vista-reportes.component.css',
})
export class VistaReportesComponent {
  reportes: ReporteFalla[] = [];
  laboratorios: Laboratorio[] = [];

  loading: { [id: number]: { recibido: boolean; solucionar: boolean } | undefined } = {};

  private setLoading(
    id: number,
    accion: 'recibido' | 'solucionar',
    estado: boolean
  ) {
    if (!this.loading[id]) {
      this.loading[id] = { recibido: false, solucionar: false };
    }
    this.loading[id][accion] = estado;
  }

  columnas: string[] = [
    'nombreUsuario',
    'descripcion',
    'lugar',
    'fechaCreacion',
    'estado',
    'acciones',
  ];

  constructor(
    private reporteService: ReporteFallaService,
    private toastr: ToastrService,
    private laboratorioService: LaboratorioService,
    private _utilities: UtilitiesService,
    private _usuarios: UsuarioService
  ) {}

  ngOnInit(): void {
    forkJoin({
      reporteTodo: this.reporteService.getReportes(),
      usuariosTodo: this._usuarios.obtenerUsuarios(),
    }).subscribe({
      next: ({ reporteTodo, usuariosTodo }) => {
        const usr = Array.isArray(usuariosTodo) ? usuariosTodo : [];
        this.reportes = reporteTodo.map((r: any) => {
          const usuario = usr.find((u) => u.id === r.idUsuario);
          return {
            ...r,
            nombreUsuario: usuario
              ? `${usuario.nombreUsuario} ${usuario.apellidoUsuario}`
              : 'Desconocido',
            fechaCreacion:
              this._utilities.formatearFecha(r.fechaCreacion) || undefined,
          };
        });
        console.log(this.reportes);
      },
    });

    this.laboratorioService.getLaboratorios().subscribe({
      next: (labs) => {
        this.laboratorios = labs;
      },
    });
  }

  cargarReportes() {
        forkJoin({
      reporteTodo: this.reporteService.getReportes(),
      usuariosTodo: this._usuarios.obtenerUsuarios(),
    }).subscribe({
      next: ({ reporteTodo, usuariosTodo }) => {
        const usr = Array.isArray(usuariosTodo) ? usuariosTodo : [];
        this.reportes = reporteTodo.map((r: any) => {
          const usuario = usr.find((u) => u.id === r.idUsuario);
          return {
            ...r,
            nombreUsuario: usuario
              ? `${usuario.nombreUsuario} ${usuario.apellidoUsuario}`
              : 'Desconocido',
            fechaCreacion:
              this._utilities.formatearFecha(r.fechaCreacion) || undefined,
          };
        });
      },
    });

    this.laboratorioService.getLaboratorios().subscribe({
      next: (labs) => {
        this.laboratorios = labs;
      },
    });
    // this.reporteService.getReportes().subscribe({
    //   next: (data) => {
    //     this.reportes = data; // Ajusta según lo que devuelva tu API
    //   },
    //   error: (err) => {
    //     this.toastr.error('Error al cargar los reportes', 'Error');
    //     console.error(err);
    //   },
    // });
  }

  recepcionReporte(reporte: ReporteFalla) {
    const dto = { IdReporte: reporte.idReporte!, estado: 2 };
    this.setLoading(reporte.idReporte!, 'recibido', true);

    this.reporteService.actualizarReporte(reporte.idReporte!, dto).subscribe({
      next: () => {
        reporte.estado = 2; // Actualiza localmente
        this.setLoading(reporte.idReporte!, 'recibido', false);
        // this.reportes = this.reportes.filter(
        //   (r) => r.idReporte !== reporte.idReporte
        // );
        this.toastr.success('Reporte recibido', 'Éxito');
      },
      error: (err) => {
        this.setLoading(reporte.idReporte!, 'recibido', false);
        this.toastr.error('Error al recibir el reporte', 'Error');
        console.error('Error recibir:', err);
      },
    });
  }

  solucionReporte(reporte: ReporteFalla) {
    const dto = { IdReporte: reporte.idReporte!, estado: 3 };
    this.setLoading(reporte.idReporte!, 'solucionar', true);

    this.reporteService.actualizarReporte(reporte.idReporte!, dto).subscribe({
      next: () => {
        reporte.estado = 3; // Actualiza localmente
        this.setLoading(reporte.idReporte!, 'solucionar', false);
        this.toastr.success('Reporte solucionado', 'Éxito');
      },
      error: (err) => {
        this.setLoading(reporte.idReporte!, 'solucionar', false);
        this.toastr.error('Error al solucionar el reporte', 'Error');
        console.error('Error solucionar:', err);
      },
    });
  }

  getNombreLaboratorio(id: number | null): string {
    const lab = this.laboratorios.find((l) => l.id === id);
    return lab ? lab.nombre : 'No especificado';
  }
}
