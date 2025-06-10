import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud-reserva-espacio.interface';
import {  SolicitudReservaService } from '../../../services/reserva-laboratorio/reserva-laboratorio.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-solicitud-reserva-laboratorio',
  imports: [BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './solicitud-reserva-laboratorio.component.html',
  styleUrl: './solicitud-reserva-laboratorio.component.css'
})
export class SolicitudReservaLaboratorioComponent {

// solicitudes: Solicitud[] = [];
// displayedColumns: string[] = ['idUsuario', 'idLaboratorio', 'horaInicio', 'horaFinal', 'motivo', 'fechaSolicitud', 'acciones'];
// dataSource = new MatTableDataSource<Solicitud>([]);

// constructor(private solicitudService: SolicitudReservaService,private toastr: ToastrService){}

//  ngOnInit(): void {
//     this.solicitudService.getResevas().subscribe((data) => {
//       this.dataSource.data = data;
//     });
//   }

// obtenerSolicitudes(): void {
//     this.solicitudService.getResevas().subscribe({
//       next: (data) => {
//         this.solicitudes = data;
//       },
//       error: () => {
//         this.toastr.error('Error al cargar las solicitudes.');
//       }
//     });
//   }

// aprobarSolicitud(solicitud: Solicitud) {
//     this.toastr.success(`Solicitud del usuario ${solicitud.idUsuario} aprobada`);
//     // Aquí puedes hacer un PUT al backend si ya tienes esa ruta
//   }

//   desaprobarSolicitud(solicitud: Solicitud) {
//     this.toastr.warning(`Solicitud del usuario ${solicitud.idUsuario} desaprobada`);
//     // Igual aquí podrías llamar al backend
//   }


}
