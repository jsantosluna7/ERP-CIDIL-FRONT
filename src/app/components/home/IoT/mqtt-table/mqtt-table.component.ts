import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatosService } from '../../../../services/Datos/datos.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { forkJoin, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PreguntaDialogComponent } from '../../../elements/pregunta-dialog/pregunta-dialog.component';
import { MqttIOTService } from '../../../../services/Api/Mqtt/mqtt-iot.service';
import { LaboratorioService } from '../../../../services/Api/Laboratorio/laboratorio.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mqtt-table',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mqtt-table.component.html',
  styleUrl: './mqtt-table.component.css',
  providers: [DatePipe]
})
export class MqttTableComponent {
  pageSize = 20;
  totalIoT = 0;
  ELEMENT_DATA: any[] = [];
  dataSource: any;
  loading: boolean = true;
  noData = true;

  constructor(
    private dialog: MatDialog,
    private _mqtt: MqttIOTService,
    private _lab: LaboratorioService,
    private _toastr: ToastrService,
    public _dialog: MatDialog,
    public _datePipe: DatePipe,
  ) {}

  displayedColumns: string[] = [
    'idPlaca',
    'codigoDeLab',
    'sensor1',
    'sensor2',
    'sensor3',
    'sensor4',
    'sensor5',
    'actuador',
    'horaEntrada',
    'acciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  endpoint: string = `${process.env['API_URL']}${process.env['ENDPOINT_IOT']}`;
  endpointLab: string = `${process.env['API_URL']}${process.env['ENDPOINT_LABORATORIO']}`;

  ngOnInit() {
    this.cargarTabla();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  exportar() {}

  cargarTabla() {
    this._mqtt.getIot(this.endpoint).subscribe({
      next: (e) => {
        const all = e.datos;

        this.totalIoT = e.paginacion.totalLoT
        console.log(all)
        const datos = all.map((data: any) => {
          return forkJoin({
            lab: this._lab.getLabById(this.endpointLab, data.idLaboratorio),
          }).pipe(
            map(({ lab }) => ({
              id: data.id,
              idPlaca: data.idPlaca,
              codigoDeLab: lab.codigoDeLab,
              sensor1: data.sensor1,
              sensor2: data.sensor2,
              sensor3: data.sensor3,
              sensor4: data.sensor4,
              sensor5: data.sensor5,
              actuador: data.actuador,
              horaEntrada: this.formatearFecha(data.horaEntrada),
            }))
          );
        });

        forkJoin(datos).subscribe({
          next: (e: any) => {
            const ELEMENT_DATA: any = e;
            this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
            this.loading = false;
            this.noData = false;
          },
          error: (err) => {
            this._toastr.error(err.error, 'Error al cargar los laboratorios');
            this.loading = false;
            this.noData = true;
          },
        });
      },
      error: (e) => {
        this._toastr.error(e.error, 'Hubo un Error');
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminar(element: any) {
    const dialogRef = this.dialog.open(PreguntaDialogComponent, {
      data: {
        titulo: '¿Seguro que quieres eliminar este IoT?',
        mensaje:
          'Se eliminará definitivamente el IoT que acabas de seleccionar',
      },
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (!response) {
        this._toastr.info('Se canceló la operación', 'Información');
      } else {
        this._mqtt.deleteIot(this.endpoint, element.id).subscribe({
          next: (h) => {
            this.cargarTabla();
          },
          error: (err) => {
            this._toastr.error(err.error, 'Hubo un error');
          },
        });
      }
    });
  }

  formatearFecha(fechaOriginal: string): string | null {
    return this._datePipe.transform(fechaOriginal, 'dd/MM/yyyy hh:mm a');
  }

  updatePageSize(event: Event) {
    const input = event.target as HTMLInputElement;
    const newSize = parseInt(input.value, 10);
    if (newSize > 0) {
      this.pageSize = newSize;
      this.paginator.pageSize = newSize;
      this.paginator.firstPage();
    }
  }
}
