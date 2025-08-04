import { Component } from '@angular/core';
import { ReporteFalla } from '../../../interfaces/reporteFalla.interface';
import { ReporteFallaService } from '../../../services/Api/ReporteFalla/reporteFalla.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LaboratorioService } from '../../../services/Laboratorio/laboratorio.service';
import { Laboratorio } from '../../../interfaces/laboratorio.interface';

@Component({
  selector: 'app-vista-reportes',
  imports: [CommonModule,MatTableModule,MatButtonModule],
  templateUrl: './vista-reportes.component.html',
  styleUrl: './vista-reportes.component.css'
})
export class VistaReportesComponent {

  reportes: ReporteFalla[] = [];
  laboratorios: Laboratorio[] = [];

  columnas: string[] = ['nombreSolicitante', 'descripcion', 'lugar', 'idLaboratorio', 'idEstado', 'acciones'];

  constructor(
    private reporteService: ReporteFallaService,
    private toastr: ToastrService,
    private laboratorioService: LaboratorioService

  ) {}



   ngOnInit(): void {
  this.reporteService.getReportes().subscribe({
    next: (reportes) => {
      this.reportes = reportes;
    }
  });

  this.laboratorioService.getLaboratorios().subscribe({
    next: (labs) => {
      this.laboratorios = labs;
    }
  });
}

 cargarReportes() {
    this.reporteService.getReportes().subscribe({
      next: (data) => {
        this.reportes = data;  // Ajusta según lo que devuelva tu API
      },
      error: (err) => {
        this.toastr.error('Error al cargar los reportes', 'Error');
        console.error(err);
      }
    });
  }



 cerrarReporte(reporte: ReporteFalla) {
  const dto = { IdReporte: reporte.idReporte!, IdEstado: 3 };
  this.reporteService.actualizarReporte(reporte.idReporte!, dto).subscribe({
    next: () => {
      reporte.idEstado = 3; // Actualiza localmente
      this.reportes = this.reportes.filter(r => r.idReporte !== reporte.idReporte);
      this.toastr.success('Reporte cerrado', 'Éxito');
    },
    error: (err) => {
      this.toastr.error('Error al cerrar el reporte', 'Error');
      console.error('Error cerrar:', err);
      console.log(dto)
    },
  });
}

reabrirReporte(reporte: ReporteFalla) {
  const dto = { IdReporte: reporte.idReporte!, IdEstado: 1 };

  this.reporteService.actualizarReporte(reporte.idReporte!,dto).subscribe({
    next: () => {
      reporte.idEstado = 1; // Actualiza localmente

      this.toastr.success('Reporte reabierto', 'Éxito');
    },
    error: (err) => {
      this.toastr.error('Error al reabrir el reporte', 'Error');
      console.error('Error reabrir:', err);
      console.log(dto)
    },
  });
}




getNombreLaboratorio(id: number | null): string {
  const lab = this.laboratorios.find(l => l.id === id);
  return lab ? lab.nombre : 'No especificado';
}



  

}
